import datetime as dt

from core.base.base_entity import BaseEntity
from crm.domain.enums import CallStatus


class FileCall(BaseEntity):
    id: int
    file_id: int
    mobile: str
    description: str
    created_by: int
    status: CallStatus
    created_at: dt.datetime

    def __init__(
        self,
        file_id: int,
        mobile: str,
        description: str,
        created_by: int,
        status: CallStatus,
    ):
        self.id = self.next_id
        self.file_id = file_id
        self.mobile = mobile
        self.description = description
        self.status = status
        self.created_by = created_by

    def dumps(self, **_) -> dict:
        base_dict = dict(id=str(self.id), created_by=str(self.created_by), file_id=str(self.file_id))
        return {
            **base_dict,
            **{field: getattr(self, field) for field in self.__annotations__ if field not in base_dict.keys()},
        }
