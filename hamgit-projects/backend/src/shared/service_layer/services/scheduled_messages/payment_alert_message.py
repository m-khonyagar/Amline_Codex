import datetime as dt
from dataclasses import dataclass

import jdatetime
from sqlalchemy import or_

import di
from account.domain.entities.user import User
from contract.domain.entities.contract import Contract
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import ContractStatus, PaymentStatus, PaymentType
from core import settings
from unit_of_work import SQLAlchemyUnitOfWork


class PaymentAlertMessage:
    sms_service = di.get_sms_service()

    @dataclass
    class MessageParams:
        mobile: str
        contract_link: str
        payment_type: str
        due_date: str
        amount: str

    @staticmethod
    def payment_type_mapper(type: PaymentType, is_bulk: bool):
        if type == PaymentType.DEPOSIT:
            return "قسط رهن"
        if type == PaymentType.RENT and is_bulk:
            return "اجاره ماهیانه"
        if type == PaymentType.RENT and not is_bulk:
            return "قسط اجاره"
        return "قسط"

    @classmethod
    def get_due_date_based_payments(cls, due_date: dt.date, is_guaranteed: bool = True) -> list[MessageParams]:
        uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
        with uow:
            query: list[tuple[ContractPayment, Contract, User]] = (
                uow.session.query(ContractPayment, Contract, User)
                .join(Contract, ContractPayment.contract_id == Contract.id)  # type: ignore
                .join(User, ContractPayment.payer_id == User.id)  # type: ignore
                .join(PropertyRentContract, Contract.id == PropertyRentContract.contract_id)
                .filter(
                    ContractPayment.due_date == due_date,  # type: ignore
                    ContractPayment.status != PaymentStatus.PAID,  # type: ignore
                    ContractPayment.deleted_at.is_(None),  # type: ignore
                    PropertyRentContract.is_guaranteed == is_guaranteed,
                    or_(
                        ContractPayment.type == PaymentType.RENT,  # type: ignore
                        ContractPayment.type == PaymentType.DEPOSIT,  # type: ignore
                    ),
                    or_(
                        Contract.status == ContractStatus.COMPLETED,  # type: ignore
                        Contract.status == ContractStatus.PDF_GENERATED,  # type: ignore
                        Contract.status == ContractStatus.PDF_GENERATING_FAILED,  # type: ignore
                    ),
                )
                .all()
            )

            return [
                cls.MessageParams(
                    mobile=user.mobile,
                    contract_link=settings.AMLINE_FRONTEND_URL
                    + settings.amline_urls.contract_payments.format(contract_id=str(contract.id)),
                    payment_type=cls.payment_type_mapper(contract_payment.type, contract_payment.is_bulk),
                    due_date=jdatetime.date.fromgregorian(date=due_date).strftime("%Y/%m/%d"),
                    amount=f"{contract_payment.amount:,}",
                )
                for contract_payment, contract, user in query
            ]

    @classmethod
    def send_payments_before_alert(cls):
        results = {
            message_param.mobile: message_param
            for message_param in cls.get_due_date_based_payments(
                due_date=dt.date.today() + dt.timedelta(days=1)
            )
        }

        for result in results.values():
            cls.sms_service.send_payment_before_alert(
                mobile=result.mobile,
                amount=result.amount,
                type=result.payment_type,
                link=result.contract_link,
                due_date=result.due_date,
            )

    @classmethod
    def send_payments_after_alert(cls):
        results = {
            message_param.mobile: message_param
            for message_param in cls.get_due_date_based_payments(
                due_date=dt.date.today() - dt.timedelta(days=1)
            )
        }

        for result in results.values():
            cls.sms_service.send_payment_after_alert(
                mobile=result.mobile,
                type=result.payment_type,
                link=result.contract_link,
            )

    @classmethod
    def send_payments_before_alert_regular_contract(cls):
        results = {
            message_param.mobile: message_param
            for message_param in cls.get_due_date_based_payments(
                due_date=dt.date.today() + dt.timedelta(days=1), is_guaranteed=False
            )
        }

        for result in results.values():
            cls.sms_service.send_payment_before_alert_regular_contract(
                mobile=result.mobile,
                amount=result.amount,
                type=result.payment_type,
                link=result.contract_link,
                due_date=result.due_date,
            )

    @classmethod
    def send_messages(cls):
        print("Sending messages")
        cls.send_payments_before_alert()
        cls.send_payments_after_alert()
        cls.send_payments_before_alert_regular_contract()
