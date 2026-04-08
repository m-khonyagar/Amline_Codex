from logging import Logger

import di
from account.domain.entities.user import User
from contract.domain.entities.contract_party import ContractParty
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import ContractStatus, PartyType, PaymentType, PRContractStep
from core import settings
from core.helpers import get_now, strings_are_similar
from financial.domain.entities.discount import Discount
from financial.domain.entities.invoice import Invoice
from financial.domain.entities.invoice_items import InvoiceItem
from financial.domain.enums import InvoiceItemType, InvoiceStatus
from financial.service_layer.events import TransactionStatusEvent
from financial.service_layer.services.wallet_service import WalletService
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import SQLAlchemyUnitOfWork, UnitOfWork

logger = Logger(__name__)


def invalidate_discount_code(uow: UnitOfWork, invoice_id: int):
    invoice_item: InvoiceItem | None = (
        uow.session.query(InvoiceItem)
        .filter(
            InvoiceItem.invoice_id == invoice_id,
            InvoiceItem.type == InvoiceItemType.DISCOUNT,
            InvoiceItem.deleted_at.is_(None),  # type: ignore
        )
        .one_or_none()
    )
    if invoice_item:
        discount: Discount | None = (
            uow.session.query(Discount).filter(Discount.code == invoice_item.extra_info).one_or_none()
        )
        if discount:
            discount.used_counts += 1


def send_message(
    counter_party_commission_invoice: Invoice | None,
    user: User,
    party: ContractParty,
    counter_party_user: User,
    payment: ContractPayment,
    sms_service: SMSService,
):
    if counter_party_commission_invoice and counter_party_commission_invoice.status == InvoiceStatus.PAID:
        print("both commission paid")
        sms_service.send_both_commissions_paid(
            mobile=user.mobile,
            contract_id=str(payment.contract_id),
            link=settings.AMLINE_FRONTEND_URL + settings.amline_urls.contract.format(contract_id=payment.contract_id),
        )
        sms_service.send_both_commissions_paid(
            mobile=counter_party_user.mobile,
            contract_id=str(payment.contract_id),
            link=settings.AMLINE_FRONTEND_URL + settings.amline_urls.contract.format(contract_id=payment.contract_id),
        )
    elif party.party_type == PartyType.TENANT:
        print("tenant commission paid")
        sms_service.send_tenant_commission_paid(
            mobile=counter_party_user.mobile,
            contract_id=str(payment.contract_id),
            link=settings.AMLINE_FRONTEND_URL
            + settings.amline_urls.contract.format(contract_id=payment.contract_id)
            + "/invoice",
        )
    elif party.party_type == PartyType.LANDLORD:
        print("landlord commission paid")
        sms_service.send_landlord_commission_paid(
            mobile=counter_party_user.mobile,
            contract_id=str(payment.contract_id),
            link=settings.AMLINE_FRONTEND_URL
            + settings.amline_urls.contract.format(contract_id=payment.contract_id)
            + "/invoice",
        )
    else:
        print("error")


def transaction_success_event_handler(event: TransactionStatusEvent):
    uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
    sms_service = di.get_sms_service()
    try:
        with uow:
            invalidate_discount_code(uow, event.invoice.id)
            payment = uow.contract_payments.get_or_raise(invoice_id=event.invoice.id)
            match payment.type:
                case PaymentType.COMMISSION:
                    user = uow.users.get_or_raise(id=payment.payer_id)
                    party = uow.contract_parties.get_by_contract_id_and_user(payment.contract_id, user)
                    if not party:
                        logger.error(f"party not found for contract_id: {payment.contract_id}")
                        return
                    counter_party = uow.contract_parties.get_counter_party(
                        contract_id=payment.contract_id, party_id=party.id
                    )
                    if not counter_party:
                        logger.error(f"counter party not found for contract_id: {payment.contract_id}")
                        return
                    counter_party_user = uow.users.get_or_raise(id=counter_party.user_id)
                    counter_party_commission_payment = uow.contract_payments.get_user_commission_payment(
                        contract_id=payment.contract_id, user_id=counter_party_user.id
                    )
                    counter_party_commission_invoice = None
                    if counter_party_commission_payment:
                        counter_party_commission_invoice = uow.invoices.get_or_raise(
                            id=counter_party_commission_payment.invoice_id
                        )
                    send_message(
                        counter_party_commission_invoice=counter_party_commission_invoice,
                        user=user,
                        party=party,
                        counter_party_user=counter_party_user,
                        payment=payment,
                        sms_service=sms_service,
                    )

                    step_type = (
                        PRContractStep.TENANT_COMMISSION
                        if party.party_type == PartyType.TENANT
                        else PRContractStep.LANDLORD_COMMISSION
                    )
                    uow.contract_steps.add_step(contract_id=payment.contract_id, type=step_type)
                    logger.info(f"contract_id: {payment.contract_id} step added for party: {party.party_type}")

                    contract_steps = uow.contract_steps.get_by_contract_id_and_types(
                        payment.contract_id, [PRContractStep.TENANT_COMMISSION, PRContractStep.LANDLORD_COMMISSION]
                    )

                    if len(contract_steps) == 2:
                        contract = uow.contracts.get_or_raise(id=payment.contract_id)
                        prc = uow.prcontracts.get_by_contract_id_or_raise(payment.contract_id)
                        contract.update_status(ContractStatus.PENDING_ADMIN_APPROVAL)
                        prc.update_contract(contract)
                        logger.info(f"contract_id: {payment.contract_id} status updated to PENDING_ADMIN_APPROVAL")

                case PaymentType.WALLET_CHARGE:
                    WalletService(uow, payment.payer_id).add_credits(
                        event.invoice.final_amount, payment.type, event.invoice.id
                    )

                case PaymentType.RENT | PaymentType.DEPOSIT:
                    payee_user = uow.users.get_or_raise(id=payment.payee_id)
                    pr_contract = uow.prcontracts.get_by_contract_id_or_raise(payment.contract_id)
                    payee_bank_account = uow.bank_accounts.get_or_raise(
                        id=(
                            pr_contract.landlord_rent_bank_account_id
                            if payment.type == PaymentType.RENT
                            else pr_contract.landlord_deposit_bank_account_id
                        )
                    )
                    if strings_are_similar(
                        payee_bank_account.owner_name, ((payee_user.first_name or "") + (payee_user.last_name or ""))
                    ) or strings_are_similar(
                        payee_bank_account.owner_name, ((payee_user.last_name or "") + (payee_user.first_name or ""))
                    ):
                        WalletService(uow, payment.payee_id).add_credits(payment.amount, payment.type, event.invoice.id)

            payment.mark_as_paid(get_now())
            uow.commit()
            logger.info(f"payment paid for invoice_id: {event.invoice.id}")

    except Exception as error:
        logger.error(error)
        logger.error(f"event: {type(event).__name__}")
        uow.rollback()
