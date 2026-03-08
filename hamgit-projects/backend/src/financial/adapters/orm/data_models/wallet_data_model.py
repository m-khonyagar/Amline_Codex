from sqlalchemy import TIMESTAMP, BigInteger, Column, ForeignKey, String, Table, func

from core.database import SQLALCHEMY_REGISTRY

wallets = Table(
    "wallets",
    SQLALCHEMY_REGISTRY.metadata,
    Column("id", BigInteger, primary_key=True),
    Column("credit", BigInteger, nullable=False),
    Column("user_id", BigInteger, ForeignKey("account.users.id"), nullable=False),
    Column("created_by", BigInteger, nullable=False),
    Column("updated_by", BigInteger),
    Column("bank_account_id", BigInteger, ForeignKey("account.bank_accounts.id")),
    Column("status", String(50), nullable=False),
    Column("created_at", TIMESTAMP(timezone=True), default=func.now()),
    Column("updated_at", TIMESTAMP(timezone=True), onupdate=func.now()),
    Column("deleted_at", TIMESTAMP(timezone=True)),
    schema="financial",
)
#     extend_existing=True,
# ).append_constraint(CheckConstraint("credit > 0", name="check_positive_credit"))
