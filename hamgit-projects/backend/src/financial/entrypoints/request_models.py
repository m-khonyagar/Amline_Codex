from datetime import datetime

from pydantic import BaseModel, field_validator

from account.domain.enums import UserRole
from contract.domain.enums import PaymentMethod, PaymentType
from core.exceptions import ValidationException
from core.translates import validation_trans
from financial.domain.enums import BankGateWay, DiscountType


# -------------------invoices------------------------------
class ApplyPromoCodeRequet(BaseModel):
    invoice_id: int
    promo_code: str


class GeneratePromoCodeRequest(BaseModel):
    value: int
    usage_limit: int | None = 10**5
    start_date: datetime | None = None
    end_date: datetime | None = None
    roles: list[UserRole] | None = None
    specified_user_phone: str | None = None
    resource_type: PaymentType | None = None
    discount_type: DiscountType
    prefix: str = ""
    code: str | None = None

    @field_validator("discount_type")
    def precentage_validator(cls, value, values):
        if value == DiscountType.PERCENTAGE and not 101 > values.data.get("value") >= 1:
            raise ValidationException(validation_trans.invalid_value_for_percentage)
        elif value == PaymentMethod.CASH and values.data.get("cheque_info"):
            raise ValidationException(validation_trans.method_and_info_dont_match)
        return value


class GenerateBulkPromoCodeRequest(BaseModel):
    count: int
    value: int
    usage_limit: int | None = 10**5
    start_date: datetime | None = None
    end_date: datetime | None = None
    roles: list[UserRole] | None = None
    specified_user_phone: str | None = None
    resource_type: PaymentType | None = None
    discount_type: DiscountType
    prefix: str = ""


# -------------------bank_transactions----------------------
class CreateTransactionRequest(BaseModel):
    invoice_id: int
    use_wallet_credit: bool | None = False
    bank_gateway: BankGateWay = BankGateWay.ZARINPAL


class GetBankGatewayRequest(BaseModel):
    authority_code: str
    status: str


class WalletManualChargeRequest(BaseModel):
    mobile: str
    amount: int
    text_message: str | None = None
