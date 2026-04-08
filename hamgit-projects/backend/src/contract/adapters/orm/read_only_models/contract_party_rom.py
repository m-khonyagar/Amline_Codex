from datetime import datetime

import sqlalchemy as sa

from account.adapters.orm.read_only_models import UserROM
from contract.domain.enums import PartyType
from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY


class ContractPartyROM(BaseROM):
    id: int
    contract_id: int
    user_id: int
    user: UserROM
    party_type: PartyType
    deleted_at: datetime | None

    def dumps(self) -> dict:
        return {
            "id": str(self.id),
            "party_type": self.party_type,
            "user": self.user.dumps(),
        }


contract_parties_rom = sa.Table(
    "contract_parties",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False),
    sa.Column("party_type", sa.String, nullable=False),
    sa.Column("deleted_at", sa.DateTime),
    schema="contract",
)
