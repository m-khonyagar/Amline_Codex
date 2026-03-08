import datetime as dt

from account.domain.entities.user import User
from account.domain.enums import UserTextSender
from core.base.base_entity import BaseEntity


class UserText(BaseEntity):
    id: int
    user_id: int
    text: str
    sender: UserTextSender
    created_by: int
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    user: User
    created_by_user: User

    def __init__(
        self,
        user_id: int,
        text: str,
        sender: UserTextSender,
        created_by: int,
    ):
        self.id = self.next_id
        self.user_id = user_id
        self.text = text
        self.sender = sender
        self.created_by = created_by

    def dumps(self, **_) -> dict:
        base_dict = dict(
            id=str(self.id),
            created_by=str(self.created_by),
            user_id=str(self.user_id),
            user=self.user.dumps(),
            created_by_user=self.created_by_user.dumps(),
        )
        return {
            **base_dict,
            **{field: getattr(self, field) for field in self.__annotations__ if field not in base_dict.keys()},
        }
