import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

bank_accounts = sa.Table(
    "bank_accounts",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("user_role", sa.String, nullable=False, index=True),
    sa.Column("iban", sa.String, nullable=False),
    sa.Column("owner_name", sa.String, nullable=False),
    sa.Column("bank_name", sa.String),
    sa.Column("branch_name", sa.String),
    sa.Column("card_number", sa.String),
    sa.Column("account_number", sa.String),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.UniqueConstraint("user_id", "user_role", "iban", name="uq_bank_account"),
    schema="account",
)
