import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

file_labels = sa.Table(
    "file_labels",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("title", sa.String, nullable=False),
    sa.Column("type", sa.String, nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="crm",
)
