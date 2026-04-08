import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

task_reports = sa.Table(
    "task_reports",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("text", sa.Text, nullable=False),
    sa.Column("created_by", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, default=sa.func.now()),
    sa.Column("task_id", sa.BigInteger, sa.ForeignKey("crm.tasks.id"), nullable=False, index=True),
    schema="crm",
)
