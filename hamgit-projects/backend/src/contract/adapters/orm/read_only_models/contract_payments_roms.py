import datetime as dt

import sqlalchemy as sa

from account.adapters.orm.read_only_models.bank_account_rom import BankAccountROM
from contract.domain import enums
from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY


class ChequeROM(BaseROM):
    id: int
    payment_id: int
    serial: str
    series: str
    sayaad_code: str
    image_file_id: int
    category: enums.ChequeCategory
    payee_type: enums.ChequePayeeType
    payee_national_code: str
    status: enums.ChequeStatus

    def dumps(self) -> dict:
        return {
            "serial": self.serial,
            "series": self.series,
            "sayaad_code": self.sayaad_code,
            "image_file": {"id": str(self.image_file_id)},
            "category": self.category,
            "payee_type": self.payee_type,
            "payee_national_code": self.payee_national_code,
            "status": self.status,
        }


class ContractPaymentROM(BaseROM):
    id: int
    cheque: ChequeROM | None
    contract_id: int
    owner_id: int
    payer_id: int
    payee_id: int
    invoice_id: int | None
    amount: int
    method: enums.PaymentMethod
    type: enums.PaymentType
    due_date: dt.date
    status: enums.PaymentStatus
    paid_at: dt.datetime | None
    is_bulk: bool
    description: str | None
    deleted_at: dt.datetime | None

    def dumps(self, bank_accounts: dict[str, BankAccountROM | None] = dict(), **kwargs) -> dict:

        payer_bank_account, payee_bank_account = self._handle_bank_accounts(bank_accounts)

        return {
            "id": str(self.id),
            "contract": {"id": str(self.contract_id)},
            "cheque": self.cheque.dumps() if self.cheque else None,
            "payer": payer_bank_account,
            "payee": payee_bank_account,
            "invoice": kwargs.get("invoice", {"id": str(self.invoice_id)} if self.invoice_id else None),
            "amount": self.amount,
            "method": self.method,
            "type": self.type,
            "status": self.status,
            "due_date": self.due_date,
            "paid_at": self.paid_at,
            "description": self.description,
            "is_bulk": self.is_bulk,
        }

    def _handle_bank_accounts(self, bank_accounts: dict[str, BankAccountROM | None] = dict()) -> tuple:
        tenant_bank_account = bank_accounts.get("tenant_bank_account")
        landlord_rent_bank_account = bank_accounts.get("landlord_rent_bank_account")
        landlord_deposit_bank_account = bank_accounts.get("landlord_deposit_bank_account")
        payer_bank_account = None
        payee_bank_account = None
        if self.type == enums.PaymentType.RENT:
            payer_bank_account = tenant_bank_account.dumps() if tenant_bank_account else {"user_id": str(self.payer_id)}
            payee_bank_account = (
                landlord_rent_bank_account.dumps() if landlord_rent_bank_account else {"user_id": str(self.payee_id)}
            )
        elif self.type == enums.PaymentType.DEPOSIT:
            payer_bank_account = tenant_bank_account.dumps() if tenant_bank_account else {"user_id": str(self.payer_id)}
            payee_bank_account = (
                landlord_deposit_bank_account.dumps()
                if landlord_deposit_bank_account
                else {"user_id": str(self.payee_id)}
            )
        elif self.type == enums.PaymentType.COMMISSION:
            if tenant_bank_account and self.payer_id == tenant_bank_account.user_id:
                payer_bank_account = tenant_bank_account.dumps()
            elif landlord_rent_bank_account and self.payer_id == landlord_rent_bank_account.user_id:
                payer_bank_account = landlord_rent_bank_account.dumps()
            elif landlord_deposit_bank_account and self.payer_id == landlord_deposit_bank_account.user_id:
                payer_bank_account = landlord_deposit_bank_account.dumps()
            else:
                payer_bank_account = {"user_id": str(self.payer_id)}

            payee_bank_account = {"user_id": str(self.payee_id), "owner_name": "AMLINE"}
        return payer_bank_account, payee_bank_account


contract_payments_rom = sa.Table(
    "contract_payments",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("owner_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False, index=True),
    sa.Column("invoice_id", sa.BigInteger, sa.ForeignKey("financial.invoices.id"), index=True),
    sa.Column("payer_id", sa.BigInteger, sa.ForeignKey("account.users.id"), index=True, nullable=False),
    sa.Column("payee_id", sa.BigInteger, sa.ForeignKey("account.users.id"), index=True, nullable=False),
    sa.Column("amount", sa.BigInteger, nullable=False),
    sa.Column("method", sa.String, nullable=False),
    sa.Column("type", sa.String, nullable=False),
    sa.Column("status", sa.String, nullable=False),
    sa.Column("due_date", sa.Date, nullable=False),
    sa.Column("paid_at", sa.DateTime(timezone=True)),
    sa.Column("description", sa.Text),
    sa.Column("is_bulk", sa.Boolean, nullable=False),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="contract",
)

cheques_rom = sa.Table(
    "cheques",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("payment_id", sa.BigInteger, sa.ForeignKey("contract.contract_payments.id"), nullable=False),
    sa.Column("serial", sa.String, nullable=False),
    sa.Column("series", sa.String, nullable=False),
    sa.Column("sayaad_code", sa.String, nullable=False),
    sa.Column("image_file_id", sa.BigInteger, nullable=False),
    sa.Column("category", sa.String, nullable=False),
    sa.Column("payee_type", sa.String, nullable=False),
    sa.Column("payee_national_code", sa.String, nullable=False),
    sa.Column("status", sa.String, nullable=False),
    schema="contract",
)
