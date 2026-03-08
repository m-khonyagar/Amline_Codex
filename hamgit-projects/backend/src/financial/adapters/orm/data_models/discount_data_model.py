from sqlalchemy import (
    ARRAY,
    TIMESTAMP,
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Table,
    func,
)

from core.database import SQLALCHEMY_REGISTRY

discounts = Table(
    "discounts",
    SQLALCHEMY_REGISTRY.metadata,
    Column("id", BigInteger, primary_key=True),
    Column("code", String(30), unique=True),
    Column("type", String(50)),
    Column("starts_at", TIMESTAMP(timezone=True)),
    Column("ends_at", TIMESTAMP(timezone=True)),
    Column("value", Float),
    Column("usage_limit", Integer),
    Column("used_counts", Integer),
    Column("resource_type", String(50)),
    Column("specified_roles", ARRAY(String(50))),
    Column("specified_user_phone", String(15)),
    Column("is_active", Boolean, default=True),
    Column("created_by", BigInteger),
    Column("created_at", DateTime(timezone=True), default=func.now()),
    Column("updated_at", DateTime(timezone=True), onupdate=func.now()),
    Column("deleted_at", TIMESTAMP(timezone=True)),
    schema="financial",
)
