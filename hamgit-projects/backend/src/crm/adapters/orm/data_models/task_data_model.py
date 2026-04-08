import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

tasks = sa.Table(
    "tasks",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("title", sa.String, nullable=False),
    sa.Column("description", sa.Text),
    sa.Column("status", sa.String, nullable=False),
    sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
    sa.Column("assigned_to", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True, onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    schema="crm",
)
