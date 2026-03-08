import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY, BIGINT

from core.database import SQLALCHEMY_REGISTRY

realtor_files = sa.Table(
    "realtor_files",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("file_status", sa.String, nullable=True),
    sa.Column("assigned_to", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=True, index=True),
    sa.Column("file_source_id", sa.BigInteger, sa.ForeignKey("crm.file_sources.id"), nullable=True, index=True),
    sa.Column("description", sa.Text),
    sa.Column("mobile", sa.String, nullable=False),
    sa.Column("full_name", sa.String, nullable=True),
    sa.Column("gender", sa.String),
    sa.Column("city_id", sa.BigInteger, sa.ForeignKey("shared.cities.id"), nullable=True, index=True),
    sa.Column("district_ids", ARRAY(BIGINT)),
    sa.Column("regions", ARRAY(BIGINT)),
    sa.Column("specialization", sa.ARRAY(sa.String)),
    sa.Column("office_name", sa.String),
    sa.Column("office_address", sa.String),
    sa.Column("office_phone", sa.String),
    sa.Column("realtor_type", sa.String),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    schema="crm",
)
