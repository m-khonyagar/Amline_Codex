from datetime import datetime

import sqlalchemy as sa

from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY


class ContractClauseROM(BaseROM):
    id: int
    contract_id: int
    clause_name: str  # نام ماده
    clause_number: int  # شماره ماده
    subclause_number: int  # شماره بند
    subclause_name: str | None  # عنوان بند
    body: str  # متن
    is_editable: bool
    is_deletable: bool
    deleted_at: datetime | None

    def dumps(self) -> dict:
        return {
            "id": str(self.id),
            "clause_name": self.clause_name,
            "clause_number": self.clause_number,
            "subclause_number": self.subclause_number,
            "subclause_name": self.subclause_name,
            "is_editable": self.is_editable,
            "is_deletable": self.is_deletable,
            "body": self.body,
        }


contract_clauses_rom = sa.Table(
    "contract_clauses",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False, index=True),
    sa.Column("clause_name", sa.String, nullable=False),
    sa.Column("clause_number", sa.Integer, nullable=False),
    sa.Column("subclause_number", sa.Integer, nullable=False),
    sa.Column("body", sa.Text, nullable=False),
    sa.Column("subclause_name", sa.String, nullable=True),
    sa.Column("is_editable", sa.Boolean, nullable=False, server_default=sa.text("true")),
    sa.Column("is_deletable", sa.Boolean, nullable=False, server_default=sa.text("true")),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="contract",
)
