import datetime as dt

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity


class TaskReport(BaseEntity):
    id: int
    text: str
    created_by: int
    created_at: dt.datetime
    task_id: int

    created_by_user: User

    def __init__(
        self,
        text: str,
        created_by: int,
        task_id: int,
    ):
        self.id = self.next_id
        self.text = text
        self.created_by = created_by
        self.task_id = task_id
        self.created_at = dt.datetime.now()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)

    def dumps(self, **_) -> dict:
        base_dict = dict(
            id=str(self.id),
            created_by=str(self.created_by),
            task_id=str(self.task_id),
            created_by_user=self.created_by_user.short_dumps(),
        )
        return {
            **base_dict,
            **{field: getattr(self, field) for field in self.__annotations__ if field not in base_dict.keys()},
        }
