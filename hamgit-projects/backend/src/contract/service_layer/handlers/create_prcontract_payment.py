"""ADMIN PANEL ROUTE"""

from account.domain.entities.user import User
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import PaymentMethod, PaymentType
from contract.domain.prcontract.steps_mapper import PAYMENT_STEP_MAPPER
from contract.service_layer.dtos import CreateContractPaymentDto
from contract.service_layer.exceptions import InvalidActionOrderException
from core.exceptions import NotFoundException, PermissionException, ValidationException
from core.translates import (
    NotFoundExcTrans,
    PermExcTrans,
    ProcessingExcTrans,
    ValidationExcTrans,
)
from unit_of_work import UnitOfWork


def create_prcontract_payment_handler(
    contract_id: int, data: CreateContractPaymentDto, uow: UnitOfWork, admin: User
) -> ContractPayment:

    if data.type not in [PaymentType.RENT, PaymentType.DEPOSIT]:
        raise PermissionException(PermExcTrans.only_rent_and_deposit_payment_types_are_allowed)

    if data.method == PaymentMethod.CHEQUE and not data.cheque_data:
        raise ValidationException(ValidationExcTrans.cheque_data_is_required_when_payment_type_is_cheque)

    if data.method != PaymentMethod.CHEQUE:
        data.cheque_data = None

    if data.payee == data.payer:
        raise ValidationException(ValidationExcTrans.payee_and_payer_cannot_be_the_same)

    with uow:
        # prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        # if prcontract.status not in [ContractStatus.EDIT_REQUESTED, ContractStatus.ADMIN_STARTED]:
        #     raise ContractIsNotEditRequestedException

        if uow.contract_steps.get_by_contract_id_and_type(contract_id, PAYMENT_STEP_MAPPER[data.type]):
            raise InvalidActionOrderException(detail=ProcessingExcTrans.payment_already_finalized)

        payer = uow.contract_parties.get_by_contract_id_and_party_type(contract_id, data.payer)
        payee = uow.contract_parties.get_by_contract_id_and_party_type(contract_id, data.payee)

        if not payer:
            raise NotFoundException(NotFoundExcTrans.payer_not_found)

        if not payee:
            raise NotFoundException(NotFoundExcTrans.payee_not_found)

        payment = ContractPayment(
            contract_id=contract_id,
            owner_id=admin.id,
            payer_id=payer.user_id,
            payee_id=payee.user_id,
            amount=data.amount,
            method=data.method,
            type=data.type,
            due_date=data.due_date,
            description=data.description,
        )

        if data.cheque_data:
            try:
                payment.set_cheque(**data.cheque_data)
            except ValidationException as exc:
                raise exc
            except Exception:
                raise ValidationException(
                    ValidationExcTrans.cheque_data_is_required_when_payment_type_is_cheque,
                )

        uow.contract_payments.add(payment)
        uow.commit()
        uow.contract_payments.refresh(payment)

        return payment
