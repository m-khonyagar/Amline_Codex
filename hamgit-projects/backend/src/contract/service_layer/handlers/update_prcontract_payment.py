from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import PaymentMethod, PaymentType
from contract.domain.prcontract.steps_mapper import PAYMENT_STEP_MAPPER
from contract.service_layer.dtos import UpdateContractPaymentDto
from core.exceptions import PermissionException, ValidationException
from core.translates import perm_trans, validation_trans
from unit_of_work import UnitOfWork


def update_prcontract_payment_handler(
    contract_id: int, payment_id: int, data: UpdateContractPaymentDto, uow: UnitOfWork
) -> ContractPayment:

    if data.method != PaymentMethod.CHEQUE:
        data.cheque_data = None

    if data.method == PaymentMethod.CHEQUE and not data.cheque_data:
        raise ValidationException(
            detail=validation_trans.cheque_data_is_required_when_payment_type_is_cheque,
        )

    if data.type not in [PaymentType.RENT, PaymentType.DEPOSIT]:
        raise PermissionException(perm_trans.only_rent_and_deposit_payment_types_are_allowed)

    with uow:
        # prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        # if prcontract.status not in [ContractStatus.EDIT_REQUESTED, ContractStatus.ADMIN_STARTED]:
        #     raise ContractIsNotEditRequestedException

        payment = uow.contract_payments.get_or_raise(id=payment_id, contract_id=contract_id)

        if data.cheque_data:
            try:
                payment.set_cheque(**data.cheque_data)
            except ValidationException as exc:
                raise exc
            except Exception:
                raise ValidationException(
                    validation_trans.cheque_data_is_required_when_payment_type_is_cheque,
                )

        payment.update(amount=data.amount, due_date=data.due_date, description=data.description, type=data.type)
        payment.method = data.method  # FIXME -> this should be in update
        STEP = PAYMENT_STEP_MAPPER[payment.type]
        if contract_step := uow.contract_steps.get_by_contract_id_and_type(contract_id, STEP):
            contract_step.revoke()
        uow.commit()
        uow.contract_payments.refresh(payment)

        return payment
