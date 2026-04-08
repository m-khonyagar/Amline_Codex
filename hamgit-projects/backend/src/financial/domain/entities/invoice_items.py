from datetime import UTC, datetime
from typing import no_type_check

from core.base.base_entity import BaseEntity
from financial.domain.enums import InvoiceItemType


class InvoiceItem(BaseEntity):
    id: int
    invoice_id: int
    extra_info: str | None = None
    type: InvoiceItemType
    amount: int
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime

    @no_type_check
    @classmethod
    def create(
        cls, invoice_id: int, type: InvoiceItemType, amount: int = 0, extra_info: str | None = None
    ) -> "InvoiceItem":
        return cls(
            id=cls.get_next_id(),
            invoice_id=invoice_id,
            type=type,
            amount=amount,
            extra_info=extra_info,
        )

    def soft_delete(self):
        self.deleted_at = datetime.now(UTC)

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            invoice_id=str(self.invoice_id),
            extra_info=self.extra_info,
            type=InvoiceItemType.resolve(self.type),
            amount=self.amount,
            created_at=self.created_at,
            updated_at=self.updated_at,
            deleted_at=self.deleted_at,
        )
