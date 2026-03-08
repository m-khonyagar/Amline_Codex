import datetime as dt

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from crm.domain.enums import TaskStatus


class Task(BaseEntity):
    id: int
    title: str
    description: str | None = None
    assigned_to: int
    status: TaskStatus
    due_date: dt.datetime | None = None
    created_by: int

    assigned_to_user: User
    created_by_user: User

    created_at: dt.datetime
    updated_at: dt.datetime | None = None
    deleted_at: dt.datetime | None = None

    def __init__(
        self,
        title: str,
        description: str | None,
        assigned_to: int,
        created_by: int,
        status: TaskStatus = TaskStatus.TODO,
        due_date: dt.datetime | None = None,
    ):
        self.id = self.next_id
        self.title = title
        self.description = description
        self.assigned_to = assigned_to
        self.status = status
        self.created_by = created_by
        self.due_date = due_date
        self.created_at = dt.datetime.now()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)

    def dumps(self, **kwargs) -> dict:
        base_dict = dict(
            id=str(self.id),
            created_by=str(self.created_by),
            assigned_to=str(self.assigned_to),
            assigned_to_user=self.assigned_to_user.short_dumps(),
            created_by_user=self.created_by_user.short_dumps(),
            **kwargs,
        )
        return {
            **base_dict,
            **{field: getattr(self, field) for field in self.__annotations__ if field not in base_dict.keys()},
        }
