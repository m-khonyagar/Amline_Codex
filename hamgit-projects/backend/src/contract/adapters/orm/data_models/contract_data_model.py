import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

id_seq = sa.Sequence("contract_id_seq", schema="contract")

contracts = sa.Table(
    "contracts",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True, server_default=id_seq.next_value()),
    sa.Column("owner_user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("type", sa.String, nullable=False),
    sa.Column("status", sa.String, nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("password", sa.String(8)),
    sa.Column("pdf_file_id", sa.BigInteger, sa.ForeignKey("shared.files_.id"), index=True),
    schema="contract",
)
