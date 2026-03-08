from datetime import date as _date
from datetime import datetime

import sqlalchemy as sa

from account.adapters.orm.read_only_models import BankAccountROM
from contract.adapters.orm.read_only_models.contract_rom import ContractROM
from contract.domain.enums import PartyType, PRContractState, TrackingCodeStatus
from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY
from shared.adapters.orm.read_only_models import PropertyROM


class PRContractROM(BaseROM):
    id: int
    property: PropertyROM
    property_id: int
    contract: ContractROM
    contract_id: int

    property_handover_date: _date | None
    date: _date | None
    start_date: _date | None
    end_date: _date | None
    deposit_amount: int | None
    rent_amount: int | None

    tenant_bank_account: BankAccountROM | None
    tenant_bank_account_id: int | None
    tenant_penalty_fee: int | None

    landlord_rent_bank_account: BankAccountROM | None
    landlord_rent_bank_account_id: int | None
    landlord_deposit_bank_account: BankAccountROM | None
    landlord_deposit_bank_account_id: int | None
    landlord_penalty_fee: int | None

    tracking_code_status: TrackingCodeStatus
    tracking_code_value: str | None
    tracking_code_generation_date: _date | None

    created_at: datetime
    deleted_at: datetime | None

    def dumps(self, state: PRContractState | None = None, owner_party_type: PartyType | None = None) -> dict:
        tenant_bank_account = self.tenant_bank_account
        landlord_rent_bank_account = self.landlord_rent_bank_account
        landlord_deposit_bank_account = self.landlord_deposit_bank_account
        bank_accounts = {
            "tenant_bank_account": tenant_bank_account,
            "landlord_rent_bank_account": landlord_rent_bank_account,
            "landlord_deposit_bank_account": landlord_deposit_bank_account,
        }

        return {
            **self.contract.dumps(bank_accounts, owner_party_type=owner_party_type),
            "state": state,
            "property_handover_date": self.property_handover_date,
            "date": self.date,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "deposit_amount": self.deposit_amount,
            "monthly_rent_amount": self.rent_amount,
            "tenant_bank_account": self.tenant_bank_account.dumps() if self.tenant_bank_account else None,
            "tenant_penalty_fee": self.tenant_penalty_fee,
            "landlord_rent_bank_account": (
                self.landlord_rent_bank_account.dumps() if self.landlord_rent_bank_account else None
            ),
            "landlord_deposit_bank_account": (
                self.landlord_deposit_bank_account.dumps() if self.landlord_deposit_bank_account else None
            ),
            "landlord_penalty_fee": self.landlord_penalty_fee,
            "tracking_code_status": self.tracking_code_status,
            "tracking_code_value": self.tracking_code_value,
            "tracking_code_generation_date": self.tracking_code_generation_date,
            "property": self.property.dumps() if self.property else None,
        }

    def list_dumps(self) -> dict:
        return {
            **self.contract.list_dumps(),
            "property_handover_date": self.property_handover_date,
            "date": self.date,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "deposit_amount": self.deposit_amount,
            "monthly_rent_amount": self.rent_amount,
            "tenant_penalty_fee": self.tenant_penalty_fee,
            "landlord_penalty_fee": self.landlord_penalty_fee,
            "tracking_code_status": self.tracking_code_status,
            "tracking_code_value": self.tracking_code_value,
            "tracking_code_generation_date": self.tracking_code_generation_date,
            "property": self.property.dumps() if self.property else None,
        }


prcontracts_rom = sa.Table(
    "property_rent_contracts",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("property_id", sa.BigInteger, sa.ForeignKey("shared.properties.id"), nullable=False),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False),
    sa.Column("property_handover_date", sa.Date),
    sa.Column("date", sa.Date),
    sa.Column("start_date", sa.Date),
    sa.Column("end_date", sa.Date),
    sa.Column("deposit_amount", sa.Integer),
    sa.Column("rent_amount", sa.Integer),
    sa.Column("tenant_bank_account_id", sa.BigInteger, sa.ForeignKey("account.bank_accounts.id")),
    sa.Column("tenant_penalty_fee", sa.Integer),
    sa.Column("landlord_rent_bank_account_id", sa.BigInteger, sa.ForeignKey("account.bank_accounts.id")),
    sa.Column("landlord_deposit_bank_account_id", sa.BigInteger, sa.ForeignKey("account.bank_accounts.id")),
    sa.Column("landlord_penalty_fee", sa.Integer),
    sa.Column("tracking_code_status", sa.String, nullable=False),
    sa.Column("tracking_code_value", sa.String),
    sa.Column("tracking_code_generation_date", sa.Date),
    sa.Column("created_at", sa.DateTime, nullable=False),
    sa.Column("deleted_at", sa.DateTime),
    schema="contract",
)
