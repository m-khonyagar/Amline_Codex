import sqlalchemy as sa
from sqlalchemy.dialects import postgresql as pg

from core.database import SQLALCHEMY_REGISTRY

files = sa.Table(
    "files_",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("access", sa.String),
    sa.Column("category", sa.String),
    sa.Column("type", sa.String),
    sa.Column("name", sa.String),
    sa.Column("size", sa.BigInteger),
    sa.Column("mime_type", sa.String),
    sa.Column("is_used", sa.Boolean, default=False),
    sa.Column("metadata", pg.JSONB),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="shared",
)
