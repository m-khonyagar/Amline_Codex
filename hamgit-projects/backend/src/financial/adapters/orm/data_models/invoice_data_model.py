from sqlalchemy import (
    TIMESTAMP,
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    String,
    Table,
    func,
)

from core.database import SQLALCHEMY_REGISTRY

invoices = Table(
    "invoices",
    SQLALCHEMY_REGISTRY.metadata,
    Column("id", BigInteger, primary_key=True),
    Column("payer_user_id", BigInteger, ForeignKey("account.users.id"), index=True),
    Column("payee_user_id", BigInteger, ForeignKey("account.users.id"), index=True),
    Column("status", String(50)),
    Column("clearing_status", String(50)),
    Column("initial_amount", BigInteger),
    Column("paid_at", TIMESTAMP(timezone=True)),
    Column("extra_info", String(100)),
    Column("created_by", BigInteger),
    Column("created_at", DateTime(timezone=True), default=func.now()),
    Column("updated_at", DateTime(timezone=True), onupdate=func.now()),
    Column("deleted_at", TIMESTAMP(timezone=True)),
    schema="financial",
)
