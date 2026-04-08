import sqlalchemy as sa

from core.database import SQLALCHEMY_REGISTRY

entity_change_logs = sa.Table(
    "entity_change_logs",
    SQLALCHEMY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("entity_type", sa.String, nullable=False),
    sa.Column("entity_id", sa.BigInteger, nullable=False),
    sa.Column("entity_field", sa.String, nullable=False),
    sa.Column("old_value", sa.String, nullable=False),
    sa.Column("new_value", sa.String, nullable=False),
    sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, default=sa.func.now()),
    schema="shared",
)
