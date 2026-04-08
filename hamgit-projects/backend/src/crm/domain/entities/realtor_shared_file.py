import datetime as dt

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from crm.domain.entities.realtor_file import RealtorFile
from crm.domain.enums import RealtorSharedFileSendType


class RealtorSharedFile(BaseEntity):
    id: int
    file_id: int
    realtor_file_id: int
    is_successful: bool
    text: str
    type: RealtorSharedFileSendType
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None
    created_by: int
    created_by_user: User
    realtor_file: RealtorFile

    def __init__(
        self,
        file_id: int,
        realtor_file_id: int,
        is_successful: bool,
        text: str,
        created_by: int,
        type: RealtorSharedFileSendType,
    ):
        self.id = self.next_id
        self.file_id = file_id
        self.realtor_file_id = realtor_file_id
        self.is_successful = is_successful
        self.text = text
        self.type = type
        self.created_by = created_by

    def dumps(self, **_) -> dict:
        base_dict = dict(
            id=str(self.id),
            file_id=str(self.file_id),
            realtor_file_id=str(self.realtor_file_id),
            created_by=str(self.created_by),
            created_by_user=self.created_by_user.short_dumps(),
            realtor_file=self.realtor_file.dumps(),
        )
        return {
            **base_dict,
            **{field: getattr(self, field) for field in self.__annotations__ if field not in base_dict.keys()},
        }
