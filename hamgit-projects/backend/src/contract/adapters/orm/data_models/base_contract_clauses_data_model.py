import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

from core.database import SQLALCHEMY_REGISTRY

base_contract_clauses = sa.Table(
    "base_contract_clauses",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("contract_type", sa.String, nullable=False),
    sa.Column("clauses_type", sa.String, nullable=False),
    sa.Column("clauses", JSONB, nullable=False),
    sa.Column("clauses_backup", JSONB, nullable=True),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.UniqueConstraint("contract_type", "clauses_type", name="uq_contract_type_clauses_type"),
    schema="contract",
)
