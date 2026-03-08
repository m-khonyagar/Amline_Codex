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

settlements = Table(
    "settlements",
    SQLALCHEMY_REGISTRY.metadata,
    Column("id", BigInteger, primary_key=True),
    Column("amount", BigInteger, nullable=False),
    Column("user_id", BigInteger, ForeignKey("account.users.id"), nullable=False),
    Column("shaba", String(24), nullable=False),
    Column("shaba_owner", String(75), nullable=False),
    Column("status", String(50), nullable=False),
    Column("description", String(500)),
    Column("settled_by", BigInteger),
    Column("settled_at", DateTime(timezone=True)),
    Column("created_at", DateTime(timezone=True), default=func.now()),
    Column("updated_at", DateTime(timezone=True), onupdate=func.now()),
    Column("deleted_at", TIMESTAMP(timezone=True)),
    schema="financial",
)
