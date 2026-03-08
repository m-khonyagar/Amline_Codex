import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

from core.database import SQLALCHEMY_REGISTRY

contract_parties = sa.Table(
    "contract_parties",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False, index=True),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("user_role", sa.String, nullable=False, index=True),
    sa.Column("party_type", sa.String, nullable=False),
    #
    sa.Column("signature_type", sa.String),
    sa.Column("signature_data", JSONB),
    sa.Column("signed_at", sa.DateTime(timezone=True)),
    #
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="contract",
)
