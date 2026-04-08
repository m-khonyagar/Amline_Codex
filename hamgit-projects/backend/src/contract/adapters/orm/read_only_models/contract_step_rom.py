from datetime import datetime

import sqlalchemy as sa

from contract.domain.enums import PRContractStep
from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY


class ContractStepROM(BaseROM):
    id: int
    contract_id: int
    type: PRContractStep
    completed_at: datetime | None
    deleted_at: datetime | None

    def dumps(self) -> dict:
        return {
            "type": self.type,
            "completed_at": self.completed_at,
        }


contract_steps_rom = sa.Table(
    "contract_steps",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("contract_id", sa.Integer, sa.ForeignKey("contract.contracts.id"), nullable=False),
    sa.Column("type", sa.String, nullable=False),
    sa.Column("completed_at", sa.DateTime),
    sa.Column("deleted_at", sa.DateTime),
    schema="contract",
)
