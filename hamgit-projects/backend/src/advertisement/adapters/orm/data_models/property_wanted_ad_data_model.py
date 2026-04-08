import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

property_wanted_ads = sa.Table(
    "property_wanted_ads",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True, nullable=False, index=True),
    sa.Column("type", sa.String(50)),
    sa.Column("title", sa.String(50)),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id")),
    sa.Column("city_id", sa.BigInteger, sa.ForeignKey("shared.cities.id")),
    sa.Column("districts", sa.ARRAY(sa.BigInteger)),
    sa.Column("property_type", sa.ARRAY(sa.String(50))),
    sa.Column("status", sa.String(50)),
    sa.Column("description", sa.String(200)),
    sa.Column("min_size", sa.INTEGER),
    sa.Column("room_count", sa.INTEGER),
    sa.Column("created_by_admin", sa.BOOLEAN),
    sa.Column("elevator", sa.BOOLEAN),
    sa.Column("storage_room", sa.BOOLEAN),
    sa.Column("parking", sa.BOOLEAN),
    sa.Column("tenant_deadline", sa.Date),
    # ----------------rent------------------#
    sa.Column("max_deposit", sa.BigInteger),
    sa.Column("max_rent", sa.BigInteger),
    # ----------------sale------------------#
    sa.Column("sale_price", sa.BigInteger),
    sa.Column("construction_year", sa.INTEGER),
    # --------------------------------------#
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
