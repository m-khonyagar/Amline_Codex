import datetime as dt

from account.domain.entities import User
from core.base.base_entity import BaseEntity


class ContractDescription(BaseEntity):
    id: int
    contract_id: int
    text: str
    created_by: int
    created_by_user: User

    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(self, contract_id: int, text: str, created_by: int) -> None:
        self.id = self.next_id
        self.contract_id = contract_id
        self.text = text
        self.created_by = created_by

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            contract_id=str(self.contract_id),
            text=self.text,
            created_by=self.created_by_user.short_dumps(),
            created_at=self.created_at.isoformat(),
        )
