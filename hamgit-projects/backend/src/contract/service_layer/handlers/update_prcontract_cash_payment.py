from account.domain.entities.user import User
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import (
    PaymentMethod,
    PaymentStatus,
    PaymentType,
    PRContractStep,
)
from contract.domain.prcontract import PRContractService
from contract.service_layer.dtos import PrContractCashPaymentDto
from core.exceptions import ProcessingException
from core.translates import processing_trans
from unit_of_work import UnitOfWork


def update_prcontract_cash_payment_handler(
    contract_id: int,
    payment_id: int,
    data: PrContractCashPaymentDto,
    user: User,
    uow: UnitOfWork,
    prc_service: PRContractService,
) -> ContractPayment:
    PAYMENT_TYPE = PaymentType.resolve(data.payment_type)
    DEPOSIT_PAYMENT = PaymentType.DEPOSIT
    DEPOSIT_PAYMENT_STEP = PRContractStep.DEPOSIT_PAYMENT
    RENT_PAYMENT_STEP = PRContractStep.RENT_PAYMENT
    STEP = DEPOSIT_PAYMENT_STEP if PAYMENT_TYPE == DEPOSIT_PAYMENT else RENT_PAYMENT_STEP

    with uow:
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        prc_service.validate_party_has_permission_for_step(prc=prcontract, party=party, step=STEP)

        payment = uow.contract_payments.get_or_raise(id=payment_id, contract_id=contract_id)

        if payment.method != PaymentMethod.CASH:
            raise ProcessingException(processing_trans.incorrect_payment_method)

        if payment.status != PaymentStatus.UNPAID:
            raise ProcessingException(processing_trans.payment_status_not_unpaid)

        payment.update(
            amount=data.amount,
            due_date=data.due_date,
            description=data.description,
        )

        STEP_TYPE = (
            PRContractStep.DEPOSIT_PAYMENT if payment.type == PaymentType.DEPOSIT else PRContractStep.RENT_PAYMENT
        )

        if contract_step := uow.contract_steps.get_by_contract_id_and_type(contract_id, STEP_TYPE):
            contract_step.revoke()

        uow.commit()
        uow.contract_payments.refresh(payment)

    return payment
