import datetime as dt

from core.base.base_entity import BaseEntity


class District(BaseEntity):
    id: int
    city_id: int
    region: int | None
    name: str
    lat: str
    long: str
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(
        self,
        city_id: int,
        region: int | None,
        name: str,
        lat: str,
        long: str,
    ):
        id = self.next_id
        self.id = id
        self.city_id = city_id
        self.region = region
        self.name = name
        self.lat = lat
        self.long = long

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if value:
                setattr(self, key, value)

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            city_id=str(self.city_id),
            region=str(self.region),
            name=self.name,
            **kwargs,
        )

    def __repr__(self) -> str:
        return f"{self.name}"
