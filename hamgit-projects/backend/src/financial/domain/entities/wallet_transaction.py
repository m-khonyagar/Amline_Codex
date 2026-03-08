from datetime import UTC, datetime

import pytz

from core.base.base_entity import BaseEntity
from financial.domain.enums import WalletTransactionCategory


class WalletTransaction(BaseEntity):
    id: int
    amount: int
    wallet_id: int
    invoice_id: int | None
    category: WalletTransactionCategory
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    def __init__(
        self,
        amount: int,
        wallet_id: int,
        category: WalletTransactionCategory,
        invoice_id: int | None = None,
    ):
        self.id = self.next_id
        self.amount = amount
        self.wallet_id = wallet_id
        self.category = category
        self.invoice_id = invoice_id
        self.created_at = datetime.now(UTC)
        self.updated_at = None
        self.deleted_at = None

    def soft_delete(self):
        self.deleted_at = datetime.now(UTC)

    def update(self, amount: int, wallet_id: int, category: WalletTransactionCategory):
        self.amount = amount
        self.wallet_id = wallet_id
        self.category = category

    def dumps(self, **kwargs):
        return dict(
            id=str(self.id),
            amount=self.amount,
            wallet_id=str(self.wallet_id),
            invoice_id=str(self.invoice_id) if self.invoice_id else None,
            category=WalletTransactionCategory.resolve(self.category),
            created_at=(self.created_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S"),
            **kwargs,
        )
