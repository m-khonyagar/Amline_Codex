import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

property_rent_contracts = sa.Table(
    "property_rent_contracts",
    SQLALCHEMY_REGISTRY.metadata,
    #
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("property_id", sa.BigInteger, sa.ForeignKey("shared.properties.id"), index=True),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False, index=True),
    #
    sa.Column("owner_user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("owner_party_type", sa.String, nullable=False),
    sa.Column("status", sa.String, nullable=False),
    sa.Column("date", sa.Date),
    sa.Column("pdf_file_id", sa.BigInteger, sa.ForeignKey("shared.files_.id"), index=True),
    sa.Column("is_guaranteed", sa.Boolean, server_default=sa.text("false")),
    sa.Column("color", sa.String),
    #
    sa.Column("property_handover_date", sa.Date),
    sa.Column("start_date", sa.Date),
    sa.Column("end_date", sa.Date),
    sa.Column("deposit_amount", sa.BigInteger),
    sa.Column("rent_amount", sa.BigInteger),
    sa.Column("rent_day", sa.Integer),
    sa.Column("tenant_family_members_count", sa.Integer),
    #
    sa.Column("tenant_bank_account_id", sa.BigInteger, sa.ForeignKey("account.bank_accounts.id"), index=True),
    sa.Column("tenant_penalty_fee", sa.BigInteger),
    #
    sa.Column("landlord_rent_bank_account_id", sa.BigInteger, sa.ForeignKey("account.bank_accounts.id"), index=True),
    sa.Column("landlord_deposit_bank_account_id", sa.BigInteger, sa.ForeignKey("account.bank_accounts.id"), index=True),
    sa.Column("landlord_penalty_fee", sa.BigInteger),
    #
    sa.Column("tracking_code_status", sa.String, nullable=False),
    sa.Column("tracking_code_value", sa.String),
    sa.Column("tracking_code_generation_date", sa.Date),
    #
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="contract",
)
