import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

contract_descriptions = sa.Table(
    "contract_descriptions",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False, index=True),
    sa.Column("text", sa.Text, nullable=False),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="contract",
)
