import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

file_texts = sa.Table(
    "file_texts",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("file_id", sa.BigInteger, nullable=False),
    sa.Column("mobile", sa.String, nullable=False),
    sa.Column("text", sa.Text, nullable=False),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, default=sa.func.now()),
    schema="crm",
)
