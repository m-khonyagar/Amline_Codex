import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

visit_requests = sa.Table(
    "visit_requests",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True, nullable=False, index=True),
    sa.Column("status", sa.String(50)),
    sa.Column("visit_date", sa.DateTime(timezone=True)),
    sa.Column("requester_mobile", sa.String(50)),
    sa.Column("description", sa.String),
    sa.Column("requester_user_id", sa.BigInteger),
    sa.Column("owner_mobile", sa.String(50)),
    sa.Column("owner_user_id", sa.BigInteger),
    sa.Column("advertisement_id", sa.BigInteger, sa.ForeignKey("advertisement.property_ads.id")),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.Column("accepted_at", sa.DateTime(timezone=True)),
    sa.Column("rejected_at", sa.DateTime(timezone=True)),
    sa.Column("accepted_by", sa.BigInteger),
    sa.Column("rejected_by", sa.BigInteger),
    schema="advertisement",
)
