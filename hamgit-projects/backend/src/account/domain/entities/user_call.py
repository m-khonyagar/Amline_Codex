import datetime as dt

from account.domain.entities.user import User
from account.domain.enums import UserCallStatus, UserCallType
from core.base.base_entity import BaseEntity


class UserCall(BaseEntity):
    id: int
    user_id: int
    description: str
    status: UserCallStatus
    type: UserCallType
    created_by: int
    user: User
    created_by_user: User
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(
        self,
        user_id: int,
        description: str,
        status: UserCallStatus,
        type: UserCallType,
        created_by: int,
    ):
        self.id = self.next_id
        self.user_id = user_id
        self.description = description
        self.status = status
        self.type = type
        self.created_by = created_by

    def short_dumps(self) -> dict:
        return dict(status=self.status)

    def dumps(self, **_) -> dict:
        base_dict = dict(
            id=str(self.id), user=self.user.short_dumps(), created_by_user=self.created_by_user.short_dumps()
        )
        return {
            **base_dict,
            **{field: getattr(self, field) for field in self.__annotations__ if field not in base_dict.keys()},
        }
