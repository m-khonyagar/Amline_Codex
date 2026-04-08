from sqlalchemy import (
    TIMESTAMP,
    BigInteger,
    Column,
    DateTime,
    Float,
    ForeignKey,
    String,
    Table,
    func,
)

from core.database import SQLALCHEMY_REGISTRY

invoice_items = Table(
    "invoice_items",
    SQLALCHEMY_REGISTRY.metadata,
    Column("id", BigInteger, primary_key=True),
    Column("invoice_id", BigInteger, ForeignKey("financial.invoices.id"), nullable=False, index=True),
    Column("type", String(50)),
    Column("amount", Float),
    Column("extra_info", String(100)),
    Column("created_at", DateTime(timezone=True), default=func.now()),
    Column("updated_at", DateTime(timezone=True), onupdate=func.now()),
    Column("deleted_at", TIMESTAMP(timezone=True)),
    schema="financial",
)
