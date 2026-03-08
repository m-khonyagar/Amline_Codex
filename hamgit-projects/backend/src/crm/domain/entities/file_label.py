from datetime import datetime

from core.base.base_entity import BaseEntity
from crm.domain.enums import LabelType


class FileLabel(BaseEntity):
    id: int
    title: str  # عنوان برچسب فایل
    type: LabelType

    created_by: int
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    def __init__(self, **kwargs):
        self.id = self.next_id
        for field in self.__annotations__:
            if field != "id":
                setattr(self, field, kwargs.get(field))

    def dumps(self, **_) -> dict:
        return dict(
            id=str(self.id),
            title=str(self.title),
            type=str(self.type),
        )

    def __repr__(self) -> str:
        return self.title
