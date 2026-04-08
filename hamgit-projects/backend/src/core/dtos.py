import datetime as dt
from dataclasses import dataclass, field

from core.base.base_dto import BaseDto
from core.enums import BaseInvoiceItemType


@dataclass
class UserVerificationResultDto(BaseDto):
    national_code: str
    birth_date: dt.date
    first_name: str | None
    last_name: str | None
    father_name: str | None
    is_verified: bool = field(default=False)


@dataclass
class InvoiceItemDto(BaseDto):
    amount: int
    type: BaseInvoiceItemType


@dataclass
class GenerateInvoiceDto(BaseDto):
    amount: int
    payer_user_id: int
    payee_user_id: int
    created_by: int
    items: list[InvoiceItemDto] = field(default_factory=list)
    paid_commissions: bool = False


@dataclass
class InvoiceDto(BaseDto):
    id: int
    final_amount: int
    paid_at: dt.datetime | None = None
