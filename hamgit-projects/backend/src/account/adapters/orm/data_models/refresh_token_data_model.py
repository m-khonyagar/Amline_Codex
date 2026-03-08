import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

refresh_tokens = sa.Table(
    "refresh_tokens",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("token", sa.String, nullable=False, unique=True),
    sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
    sa.Column("is_revoked", sa.Boolean, nullable=False, default=False),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="account",
)
