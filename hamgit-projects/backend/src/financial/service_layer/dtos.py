from dataclasses import dataclass
from datetime import datetime

from account.domain.enums import UserRole
from contract.domain.enums import PaymentType
from core.base.base_dto import BaseDto
from financial.domain.enums import BankGateWay, DiscountType, SettlementStatus

# -------------------invoices------------------------------


@dataclass
class GeneratePromoCodeDto(BaseDto):
    value: int
    discount_type: DiscountType
    start_date: datetime | None
    end_date: datetime | None
    roles: list[UserRole] | None
    usage_limit: int | None = 10**5
    resource_type: PaymentType = PaymentType.COMMISSION
    specified_user_phone: str | None = None
    prefix: str | None = None
    code: str | None = None


@dataclass
class ApplyPromoCodeDto(BaseDto):
    invoice_id: int
    promo_code: str


@dataclass
class DeleteInvoiceItemDto(BaseDto):
    invoice_item_id: int


# -------------------bank_transactions----------------------


@dataclass
class PayInvoiceDto(BaseDto):
    invoice_id: int
    bank_gateway: BankGateWay = BankGateWay.PARSIAN

    use_wallet_credit: bool | None = False
    use_all_wallet_credits: bool | None = False
    wallet_credits: int | None = None


@dataclass
class MessageToUserDto(BaseDto):
    link: str
    invoice_id: int
    mobile: str | None = None


@dataclass
class GetBankGatewayDto(BaseDto):
    authority_code: str
    status: str


@dataclass
class CreateSettlementDto(BaseDto):
    amount: int
    shaba: str | None = None
    shaba_owner: str | None = None


@dataclass
class UpdateSettlementDto(BaseDto):
    settlement_id: int
    status: SettlementStatus
    description: str | None = None
