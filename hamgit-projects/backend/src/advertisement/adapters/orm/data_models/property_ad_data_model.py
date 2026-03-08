import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

from core.database import SQLALCHEMY_REGISTRY

property_ads = sa.Table(
    "property_ads",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True, nullable=False, index=True),
    sa.Column("type", sa.String(50)),
    sa.Column("category", sa.String(50)),
    sa.Column("title", sa.String(50)),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id")),
    sa.Column("city_id", sa.BigInteger, sa.ForeignKey("shared.cities.id")),
    sa.Column("district_id", sa.BigInteger, sa.ForeignKey("shared.districts.id")),
    sa.Column("property_id", sa.BigInteger, sa.ForeignKey("shared.properties.id")),
    sa.Column("location", JSONB),
    sa.Column("image_file_ids", sa.ARRAY(sa.BigInteger)),
    sa.Column("status", sa.String(50)),
    sa.Column("description", sa.Text),
    sa.Column("created_by_admin", sa.BOOLEAN),
    # ----------------rent------------------#
    sa.Column("deposit_amount", sa.BigInteger),
    sa.Column("rent_amount", sa.BigInteger),
    # ----------------sale------------------#
    sa.Column("sale_price", sa.BigInteger),
    # --------------------------------------#
    sa.Column("created_by", sa.BigInteger),
    sa.Column("accepted_by", sa.BigInteger),
    sa.Column("accepted_at", sa.DateTime(timezone=True)),
    sa.Column("rejected_at", sa.DateTime(timezone=True)),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.Column("is_reported", sa.Boolean, default=False),
    sa.Column("report_description", sa.String(255)),
    sa.Column("dynamic_amounts", sa.Boolean, default=False),
    schema="advertisement",
)
