import sqlalchemy as sa

from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY


class UserROM(BaseROM):
    id: int
    mobile: str
    first_name: str | None
    last_name: str | None
    national_code: str | None
    address: str | None
    father_name: str | None

    def dumps(self) -> dict:
        return dict(
            id=str(self.id),
            mobile=self.mobile,
            first_name=self.first_name,
            last_name=self.last_name,
            national_code=self.national_code,
            address=self.address,
            father_name=self.father_name,
        )


users_rom = sa.Table(
    "users",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("mobile", sa.String, nullable=False),
    sa.Column("first_name", sa.String),
    sa.Column("last_name", sa.String),
    sa.Column("address", sa.String),
    sa.Column("father_name", sa.String),
    sa.Column("national_code", sa.String),
    sa.Column("deleted_at", sa.DateTime),
    schema="account",
)
