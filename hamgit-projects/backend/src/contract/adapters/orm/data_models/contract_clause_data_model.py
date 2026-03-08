import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

contract_clauses = sa.Table(
    "contract_clauses",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("contract_id", sa.BigInteger, sa.ForeignKey("contract.contracts.id"), nullable=False, index=True),
    sa.Column("clause_name", sa.String, nullable=False),
    sa.Column("clause_number", sa.Integer, nullable=False),
    sa.Column("subclause_number", sa.Integer, nullable=False),
    sa.Column("body", sa.Text, nullable=False),
    sa.Column("subclause_name", sa.String, nullable=True),
    sa.Column("is_editable", sa.Boolean, nullable=False, server_default=sa.text("true")),
    sa.Column("is_deletable", sa.Boolean, nullable=False, server_default=sa.text("true")),
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    sa.UniqueConstraint("contract_id", "clause_number", "subclause_number", "deleted_at", name="uq_contract_clause"),
    schema="contract",
)
