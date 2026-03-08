import sqlalchemy as sa

from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY


class ProvinceROM(BaseROM):
    id: int
    name: str


class CityROM(BaseROM):
    id: int
    province_id: int
    province: ProvinceROM
    name: str

    def dumps(self) -> dict:
        return {"id": str(self.id), "province": self.province.name, "name": self.name}


cities_rom = sa.Table(
    "cities",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("province_id", sa.Integer, sa.ForeignKey("shared.provinces.id"), nullable=False),
    sa.Column("name", sa.String, nullable=False),
    schema="shared",
)

provinces_rom = sa.Table(
    "provinces",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.Integer, primary_key=True),
    sa.Column("name", sa.String, nullable=False),
    schema="shared",
)
