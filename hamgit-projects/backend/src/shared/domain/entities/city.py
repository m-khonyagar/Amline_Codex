import datetime as dt

from core.base.base_entity import BaseEntity
from shared.domain.entities.province import Province


class City(BaseEntity):
    id: int
    province_id: int
    name: str
    slug: str
    lat: str
    long: str
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    province: Province

    def __init__(
        self,
        province_id: int,
        name: str,
        slug: str,
        lat: str,
        long: str,
    ):
        id = self.next_id
        self.id = id
        self.province_id = province_id
        self.name = name
        self.slug = slug
        self.lat = lat
        self.long = long

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            province=self.province.name,
            name=self.name,
            **kwargs,
        )

    def __repr__(self) -> str:
        return f"{self.name}"
