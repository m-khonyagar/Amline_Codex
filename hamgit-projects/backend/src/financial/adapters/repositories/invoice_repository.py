import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from financial.domain.entities.invoice import Invoice


class InvoiceRepository(AbstractRepository[Invoice], abc.ABC): ...


class SQLALchemyInvoiceRepository(AbstractSQLAlchemyRepository[Invoice], InvoiceRepository):

    @property
    def entity_type(self) -> Type[Invoice]:
        return Invoice
