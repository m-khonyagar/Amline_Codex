from datetime import date as _date
from datetime import datetime

import sqlalchemy as sa

from account.adapters.orm.read_only_models.bank_account_rom import BankAccountROM
from contract.adapters.orm.read_only_models.contract_clause_rom import ContractClauseROM
from contract.adapters.orm.read_only_models.contract_party_rom import ContractPartyROM
from contract.adapters.orm.read_only_models.contract_payments_roms import (
    ContractPaymentROM,
)
from contract.adapters.orm.read_only_models.contract_step_rom import ContractStepROM
from contract.domain import enums
from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY


class ContractROM(BaseROM):
    id: int
    owner_user_id: int
    owner_party_type: enums.PartyType | None = None
    status: enums.ContractStatus
    type: enums.ContractType
    date: _date | None = None
    parties: list[ContractPartyROM]
    steps: list[ContractStepROM]
    clauses: list[ContractClauseROM]
    payments: list[ContractPaymentROM]
    deleted_at: datetime | None

    def dumps(
        self, bank_accounts: dict[str, BankAccountROM | None] = dict(), owner_party_type: enums.PartyType | None = None
    ) -> dict:
        steps = {step.type: step.completed_at for step in self.steps}
        for item in enums.PRContractStep:
            if item not in steps:
                steps[item] = None
        return dict(
            id=str(self.id),
            owner={"id": str(self.owner_user_id), "party_type": self.owner_party_type or owner_party_type},
            type=self.type,
            status=self.status,
            date=self.date,
            parties=[party.dumps() for party in self.parties],
            steps=steps,
            clauses=[clause.dumps() for clause in self.clauses],
            payments=[payment.dumps(bank_accounts) for payment in self.payments],
        )

    def list_dumps(self) -> dict:
        return dict(
            id=str(self.id),
            owner={"id": str(self.owner_user_id), "party_type": self.owner_party_type},
            type=self.type,
            status=self.status,
            date=self.date,
            parties=[party.dumps() for party in self.parties],
        )


contracts_rom = sa.Table(
    "contracts",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("owner_user_id", sa.Integer, sa.ForeignKey("account.users.id"), nullable=False),
    # sa.Column("owner_party_type", sa.String, nullable=False),
    sa.Column("status", sa.String, nullable=False),
    sa.Column("type", sa.String, nullable=False),
    # sa.Column("date", sa.Date, nullable=False),
    sa.Column("deleted_at", sa.DateTime),
    schema="contract",
)
