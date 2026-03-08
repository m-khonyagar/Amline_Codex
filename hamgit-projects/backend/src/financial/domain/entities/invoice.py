from datetime import UTC, datetime
from typing import no_type_check

import pytz
from sqlalchemy import event

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from financial.domain.entities.invoice_items import InvoiceItem
from financial.domain.enums import InvoiceClearingStatus, InvoiceStatus


class Invoice(BaseEntity):
    id: int
    payer_user_id: int
    payee_user_id: int
    status: InvoiceStatus
    initial_amount: int
    paid_at: datetime
    clearing_status: InvoiceClearingStatus
    created_by: int
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime

    payer: User
    payee: User
    items: list[InvoiceItem] | None = []
    final_amount: int = 0

    @no_type_check
    @classmethod
    def create(cls, payer_user_id: int, payee_user_id: int, initial_amount: int, created_by: int) -> "Invoice":
        return cls(
            id=cls.get_next_id(),
            payer_user_id=payer_user_id,
            payee_user_id=payee_user_id,
            initial_amount=initial_amount,
            created_by=created_by,
            status=InvoiceStatus.NOT_PAID,
            clearing_status=InvoiceClearingStatus.NOT_CLEARED,
        )

    def mark_as_paid(self, paid_at: datetime) -> None:
        self.status = InvoiceStatus.PAID
        self.paid_at = paid_at

    def _calculate_final_amount(self):
        if hasattr(self, "items") and self.items:
            self.final_amount = sum(item.amount for item in self.items if item.deleted_at is None) + self.initial_amount
        else:
            self.final_amount = self.initial_amount

    def calculate_final_amount(self):
        if hasattr(self, "items") and self.items:
            return sum([item.amount for item in self.items if item.deleted_at is None]) + self.initial_amount
        else:
            return self.initial_amount

    def soft_delete(self):
        self.deleted_at = datetime.now(UTC)
        if hasattr(self, "items") and self.items:
            for i in self.items:
                i.deleted_at = datetime.now(UTC)

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            payer_user_id=str(self.payer_user_id),
            payee_user_id=str(self.payee_user_id),
            status=InvoiceStatus.resolve(self.status),
            initial_amount=self.initial_amount,
            paid_at=(
                (self.paid_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if self.paid_at
                else None
            ),
            clearing_status=InvoiceClearingStatus.resolve(self.clearing_status),
            created_by=str(self.created_by),
            created_at=self.created_at,
            updated_at=self.updated_at,
            deleted_at=self.deleted_at,
            final_amount=self.final_amount,
            items=(
                [i.dumps() for i in self.items if i.deleted_at is None] if hasattr(self, "items") and self.items else []
            ),
            payer=self.payer.dumps() if self.payer else None,
            payee=self.payee.dumps() if self.payee else None,
            **kwargs,
        )


@event.listens_for(Invoice, "load")
@event.listens_for(Invoice, "refresh")
def receive_load_refresh(target: Invoice, *arg, **kwargs):
    target._calculate_final_amount()
