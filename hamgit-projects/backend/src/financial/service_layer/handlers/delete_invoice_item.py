from core.exceptions import PermissionException
from core.translates import perm_trans
from core.types import CurrentUser
from financial.domain.enums import InvoiceItemType
from financial.service_layer.dtos import DeleteInvoiceItemDto
from unit_of_work import UnitOfWork


def delete_invoice_item_handler(command: DeleteInvoiceItemDto, uow: UnitOfWork, current_user: CurrentUser) -> bool:
    with uow:
        invoice_item = uow.invoice_items.get_or_raise(id=command.invoice_item_id)
        if invoice_item.type != InvoiceItemType.DISCOUNT:
            raise PermissionException(perm_trans.forbidden_action)
        invoice_item.soft_delete()
        uow.commit()

        return True
