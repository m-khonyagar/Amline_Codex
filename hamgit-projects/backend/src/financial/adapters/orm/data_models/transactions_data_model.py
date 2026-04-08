from sqlalchemy import TIMESTAMP, BigInteger, Column, ForeignKey, String, Table, func

from core.database import SQLALCHEMY_REGISTRY

transactions = Table(
    "transactions",
    SQLALCHEMY_REGISTRY.metadata,
    Column("id", BigInteger, primary_key=True),
    Column("invoice_id", BigInteger, ForeignKey("financial.invoices.id"), nullable=False, index=True),
    Column("card_number", String(16)),
    Column("gateway", String(50)),
    Column("amount", BigInteger),
    Column("status", String(50)),
    Column("authority_code", String),
    Column("reference_id", String),
    Column("verified_at", TIMESTAMP(timezone=True)),
    Column("description", String),
    Column("created_at", TIMESTAMP(timezone=True), default=func.now()),
    Column("updated_at", TIMESTAMP(timezone=True), onupdate=func.now()),
    Column("deleted_at", TIMESTAMP(timezone=True)),
    schema="financial",
)
