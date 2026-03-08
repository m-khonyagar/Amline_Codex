import datetime as dt

from core.base.base_entity import BaseEntity


class Province(BaseEntity):
    id: int
    name: str
    slug: str
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(
        self,
        name: str,
        slug: str,
    ):
        self.id = self.next_id
        self.name = name
        self.slug = slug

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            name=self.name,
            **kwargs,
        )
