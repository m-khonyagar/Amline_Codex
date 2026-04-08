from account.domain.entities.user import User
from core.exceptions import NotFoundException, ProcessingException
from core.translates import not_found_trans, processing_trans
from financial.service_layer.services.invoice_service import InvoiceService
from unit_of_work import UnitOfWork


def get_user_commission_invoice_view(
    contract_id: int, user: User, uow: UnitOfWork, invoice_service: InvoiceService
) -> dict:

    with uow:
        uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)

        commission_payment = uow.contract_payments.get_user_commission_payment(contract_id, user.id)

        if commission_payment is None:
            raise NotFoundException(not_found_trans.commission_payment_not_found)

        if commission_payment.invoice_id is None:
            raise ProcessingException(processing_trans.invoice_not_created)

        return invoice_service.get_invoice_by_id(commission_payment.invoice_id, type=commission_payment.type)
