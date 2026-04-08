import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

cheques = sa.Table(
    "cheques",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("payment_id", sa.BigInteger, sa.ForeignKey("contract.contract_payments.id"), nullable=False),
    sa.Column("serial", sa.String, nullable=False),
    sa.Column("series", sa.String, nullable=False),
    sa.Column("sayaad_code", sa.String, nullable=False),
    sa.Column("image_file_id", sa.BigInteger, sa.ForeignKey("shared.files_.id"), index=True),
    sa.Column("category", sa.String, nullable=False),
    sa.Column("payee_type", sa.String, nullable=False),
    sa.Column("payee_national_code", sa.String, nullable=False),
    sa.Column("status", sa.String, nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="contract",
)
