from account.domain.entities.user import User
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import PaymentStatus
from core.exceptions import PermissionException, ProcessingException
from core.translates import perm_trans, processing_trans
from unit_of_work import UnitOfWork


def payer_claimed_to_have_paid_handler(
    contract_id: int, payment_id: int, user: User, uow: UnitOfWork
) -> ContractPayment:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        payment = uow.contract_payments.get_or_raise(id=payment_id, contract_id=contract.id)

        if payment.payer_id != user.id:
            raise PermissionException(perm_trans.user_is_not_payment_payer)

        if payment.status != PaymentStatus.UNPAID.name:
            raise ProcessingException(processing_trans.payment_status_not_unpaid)

        payment.status = PaymentStatus.PAYER_CLAIMED_TO_HAVE_PAID
        uow.commit()
        uow.contract_payments.refresh(payment)
        return payment
