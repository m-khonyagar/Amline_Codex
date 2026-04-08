import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

contract_payments = sa.Table(
    "contract_payments",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("owner_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False, index=True),
    sa.Column("invoice_id", sa.BigInteger, sa.ForeignKey("financial.invoices.id"), index=True),
    sa.Column("payer_id", sa.BigInteger, sa.ForeignKey("account.users.id"), index=True, nullable=False),
    sa.Column("payee_id", sa.BigInteger, sa.ForeignKey("account.users.id"), index=True, nullable=False),
    sa.Column("amount", sa.BigInteger, nullable=False),
    sa.Column("method", sa.String, nullable=False),
    sa.Column("type", sa.String, nullable=False),
    sa.Column("status", sa.String, nullable=False),
    sa.Column("due_date", sa.Date, nullable=False),
    sa.Column("paid_at", sa.DateTime(timezone=True)),
    sa.Column("description", sa.Text),
    sa.Column("is_bulk", sa.Boolean, nullable=False, default=False),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="contract",
)
