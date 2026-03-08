import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

swap_ads = sa.Table(
    "swap_ads",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True, nullable=False, index=True),
    sa.Column("title", sa.String(50)),
    sa.Column("have", sa.Text),
    sa.Column("want", sa.Text),
    sa.Column("price", sa.BigInteger),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id")),
    sa.Column("status", sa.String(50)),
    sa.Column("created_by_admin", sa.BOOLEAN),
    sa.Column("created_by", sa.BigInteger),
    sa.Column("accepted_by", sa.BigInteger),
    sa.Column("accepted_at", sa.DateTime(timezone=True)),
    sa.Column("rejected_at", sa.DateTime(timezone=True)),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.Column("is_reported", sa.BOOLEAN, default=False),
    sa.Column("report_description", sa.String(255)),
    schema="advertisement",
)
