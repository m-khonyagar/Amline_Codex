from account.domain.enums import UserRole
from contract.domain.enums import PaymentType
from core.base.base_response_model import BaseResponse
from financial.domain.enums import (
    BankGateWay,
    DiscountType,
    InvoiceClearingStatus,
    InvoiceItemType,
    InvoiceStatus,
    TransactionStatus,
    WalletStatus,
    WalletTransactionCategory,
)


class BankAccountResponseModel(BaseResponse):
    id: str | None = None
    user_id: str | None = None
    user_role: UserRole | dict = {}
    iban: str | None = None
    owner_name: str | None = None
    bank_name: str | None = None
    branch_name: str | None = None
    card_number: str | None = None
    account_number: str | None = None


class InvoiceResponseModel(BaseResponse):
    id: str | None = None
    payer_bank_account_id: str | None = None
    payee_bank_account_id: str | None = None
    status: InvoiceStatus | dict = {}
    initial_amount: int | None = None
    paid_at: str | None = None
    clearing_status: InvoiceClearingStatus | dict = {}
    created_by: str | None = None
    items: list["InvoiceItemResponseModel"] | None = None
    final_amount: int | None = 0
    contract_id: str | None = None


class InvoiceItemResponseModel(BaseResponse):
    id: str | None = None
    invoice_id: str | None = None
    extra_info: str | None = None
    type: InvoiceItemType | dict = {}
    amount: int | None = None


class TransactionResponseModel(BaseResponse):
    id: str | None = None
    amount: int | None = None
    invoice_id: str | None = None
    status: TransactionStatus | dict = {}
    details: dict | None = None
    card_number: str | None = None
    description: str | None = None
    reference_id: str | None = None
    authority_code: str | None = None
    gateway: BankGateWay | None = None
    verified_at: str | None = None
    invoice: InvoiceResponseModel | None = None


class DiscountResponseModel(BaseResponse):
    id: str | None = None
    code: str | None = None
    type: DiscountType | dict = {}
    value: int | None = None
    starts_at: str | None = None
    ends_at: str | None = None
    is_active: bool | None = False
    usage_limit: int | None = None
    used_counts: int | None = None
    specified_roles: list[UserRole] | None = None
    resource_type: PaymentType | None = None
    created_by: str | None = None


class WalletResponseModel(BaseResponse):
    id: str | None = None
    credit: int | None = None
    user_id: str | None = None
    created_by: str | None = None
    updated_by: str | None = None
    bank_account_id: str | None = None
    status: WalletStatus | dict = {}
    created_at: str | None = None
    updated_at: str | None = None


class WalletTransactionsResponseModel(BaseResponse):
    id: str | None = None
    amount: int
    wallet_id: str
    invoice_id: str | None
    category: WalletTransactionCategory
    created_at: str | None = None
