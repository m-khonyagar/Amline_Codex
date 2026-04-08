import datetime as dt

from core.base.base_entity import BaseEntity


class FileText(BaseEntity):
    id: int
    file_id: int
    mobile: str
    text: str
    created_by: int
    created_at: dt.datetime

    def __init__(
        self,
        file_id: int,
        mobile: str,
        text: str,
        created_by: int,
    ):
        self.id = self.next_id
        self.file_id = file_id
        self.mobile = mobile
        self.text = text
        self.created_by = created_by

    def dumps(self, **_) -> dict:
        base_dict = dict(id=str(self.id), created_by=str(self.created_by), file_id=str(self.file_id))
        return {
            **base_dict,
            **{field: getattr(self, field) for field in self.__annotations__ if field not in base_dict.keys()},
        }
