import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

saved_ads = sa.Table(
    "saved_ads",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id")),
    sa.Column("ad_id", sa.BigInteger),
    sa.Column("ad_type", sa.String),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="account",
)
