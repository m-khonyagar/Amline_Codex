from datetime import datetime
from typing import no_type_check

from core.base.base_entity import BaseEntity
from financial.domain.entities.invoice import Invoice
from financial.domain.enums import BankGateWay, TransactionStatus


class Transaction(BaseEntity):
    id: int
    amount: int
    invoice_id: int
    status: TransactionStatus
    details: dict | None = None
    card_number: str | None = None
    description: str | None = None
    reference_id: str | None = None  # equivalent to RRN for parsian
    authority_code: str | None = None  # equivalent to Token for parsian
    gateway: BankGateWay
    verified_at: datetime | None = None

    invoice: Invoice | None

    @no_type_check
    @classmethod
    def create(
        cls,
        amount: int,
        invoice_id: int,
        status: TransactionStatus,
        details: dict | None = None,
        card_number: str | None = None,
        description: str | None = None,
        reference_id: str | None = None,
        authority_code: str | None = None,
        gateway: BankGateWay = BankGateWay.ZARINPAL,
        verified_at: datetime | None = None,
    ) -> "Transaction":
        return cls(
            id=cls.get_next_id(),
            invoice_id=invoice_id,
            card_number=card_number,
            details=details,
            gateway=gateway,
            amount=amount,
            status=status,
            authority_code=authority_code,
            reference_id=reference_id,
            verified_at=verified_at,
            description=description,
        )

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            amount=self.amount,
            invoice_id=str(self.invoice_id),
            status=TransactionStatus.resolve(self.status),
            details=self.details,
            card_number=self.card_number,
            description=self.description,
            reference_id=self.reference_id,
            authority_code=self.authority_code,
            gateway=BankGateWay.resolve(self.gateway),
            verified_at=self.verified_at,
        )
