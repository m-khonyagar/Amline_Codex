import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

from core.database import SQLALCHEMY_REGISTRY

contract_steps = sa.Table(
    "contract_steps",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False, index=True),
    sa.Column("type", sa.String, nullable=False),
    sa.Column("completed_at", sa.DateTime(timezone=True)),
    sa.Column("metadata", JSONB),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.UniqueConstraint("contract_id", "type", "deleted_at", name="uq_contract_steps"),
    schema="contract",
)
