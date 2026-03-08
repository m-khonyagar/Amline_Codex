import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from financial.domain.entities.invoice_items import InvoiceItem


class InvoiceItemRepository(AbstractRepository[InvoiceItem], abc.ABC):
    def find_by_invoice(self, invoice_id: int) -> InvoiceItem | None:
        return self._find_by_invoice(invoice_id)

    @abc.abstractmethod
    def _find_by_invoice(self, invoice_id: int) -> InvoiceItem | None: ...


class SQLALchemyInvoiceItemRepository(AbstractSQLAlchemyRepository[InvoiceItem], InvoiceItemRepository):

    @property
    def entity_type(self) -> Type[InvoiceItem]:
        return InvoiceItem

    def _find_by_invoice(self, invoice_id: int) -> InvoiceItem | None:
        return self.query.filter_by(invoice_id=invoice_id, deleted_at=None).one_or_none()
