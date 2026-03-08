import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

realtor_shared_files = sa.Table(
    "realtor_shared_files",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("file_id", sa.BigInteger, nullable=False),
    sa.Column("realtor_file_id", sa.BigInteger, sa.ForeignKey("crm.realtor_files.id"), nullable=False, index=True),
    sa.Column("is_successful", sa.Boolean, nullable=False),
    sa.Column("text", sa.Text, nullable=False),
    sa.Column("type", sa.String, nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    schema="crm",
)
