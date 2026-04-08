from datetime import datetime

import sqlalchemy as sa

from account.adapters.orm.read_only_models.user_rom import UserROM
from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY


class BankAccountROM(BaseROM):
    id: int
    user: UserROM
    iban: str
    owner_name: str
    user_id: int
    deleted_at: datetime | None

    def dumps(self) -> dict:
        return dict(
            id=str(self.id),
            user_id=str(self.user_id),
            iban=self.iban,
            owner_name=self.owner_name,
        )


bank_accounts_rom = sa.Table(
    "bank_accounts",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False),
    sa.Column("iban", sa.String, nullable=False),
    sa.Column("owner_name", sa.String, nullable=False),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="account",
)
