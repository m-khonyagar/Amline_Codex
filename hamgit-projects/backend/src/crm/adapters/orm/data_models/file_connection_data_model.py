import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

file_connections = sa.Table(
    "file_connections",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("landlord_file_id", sa.BigInteger, sa.ForeignKey("crm.landlord_files.id"), nullable=False, index=True),
    sa.Column("tenant_file_id", sa.BigInteger, sa.ForeignKey("crm.tenant_files.id"), nullable=False, index=True),
    sa.Column("status", sa.String, nullable=False),
    sa.Column("initiator", sa.String, nullable=False),
    sa.Column("description", sa.String, nullable=True),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.UniqueConstraint("landlord_file_id", "tenant_file_id", name="uq_file_connection"),
    schema="crm",
)
