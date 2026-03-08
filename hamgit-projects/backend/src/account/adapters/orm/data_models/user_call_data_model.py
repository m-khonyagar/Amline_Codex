import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

user_calls = sa.Table(
    "user_calls",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("description", sa.Text, nullable=False),
    sa.Column("status", sa.String, nullable=True),
    sa.Column("type", sa.String, nullable=False),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True, onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    schema="account",
)
