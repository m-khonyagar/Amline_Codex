import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

provinces = sa.Table(
    "provinces",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("name", sa.String(50), nullable=False),
    sa.Column("slug", sa.String(50), nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="shared",
)
