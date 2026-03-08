from sqlalchemy import TIMESTAMP, BigInteger, Column, ForeignKey, String, Table, func

from core.database import SQLALCHEMY_REGISTRY

wallet_transactions = Table(
    "wallet_transactions",
    SQLALCHEMY_REGISTRY.metadata,
    Column("id", BigInteger, primary_key=True),
    Column("amount", BigInteger, nullable=False),
    Column("invoice_id", BigInteger, ForeignKey("financial.invoices.id")),
    Column("wallet_id", BigInteger, ForeignKey("financial.wallets.id"), nullable=False),
    Column("category", String(50), nullable=False),
    Column("created_at", TIMESTAMP(timezone=True), default=func.now()),
    Column("updated_at", TIMESTAMP(timezone=True), onupdate=func.now()),
    Column("deleted_at", TIMESTAMP(timezone=True)),
    schema="financial",
)
