from core.exceptions import PermissionException
from core.translates import perm_trans
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def get_single_invoice(uow: UnitOfWork, invoice_id: int, current_user: CurrentUser):
    with uow:
        invoice = uow.invoices.get_or_raise(id=invoice_id)

        if current_user.id not in (invoice.payer_user_id, invoice.payee_user_id):
            raise PermissionException(perm_trans.access_denied)

        cpayment = uow.contract_payments.get_or_raise(invoice_id=invoice.id)

        return invoice.dumps(contract_id=str(cpayment.contract_id), category=cpayment.type)
