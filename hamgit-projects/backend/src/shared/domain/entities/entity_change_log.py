import datetime as dt

from core.base.base_entity import BaseEntity


class EntityChangeLog(BaseEntity):
    id: int
    user_id: int  # foreign key to user.id
    entity_type: str
    entity_id: int
    entity_field: str
    old_value: str
    new_value: str
    created_at: dt.datetime

    def __init__(
        self,
        user_id: int,
        entity_type: str,
        entity_id: int,
        entity_field: str,
        old_value: str,
        new_value: str,
    ):
        self.id = self.next_id
        self.user_id = user_id
        self.entity_type = entity_type
        self.entity_id = entity_id
        self.entity_field = entity_field
        self.old_value = old_value
        self.new_value = new_value

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            user_id=str(self.user_id),
            entity_type=self.entity_type,
            entity_id=str(self.entity_id),
            entity_field=self.entity_field,
            created_at=self.created_at,
            **kwargs,
        )

    @classmethod
    def loads(cls, data: dict) -> "EntityChangeLog":
        return cls(
            user_id=data["user_id"],
            entity_type=data["entity_type"],
            entity_id=data["entity_id"],
            entity_field=data["entity_field"],
            old_value=data["old_value"],
            new_value=data["new_value"],
        )
