from datetime import datetime
from typing import no_type_check

import pytz

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from financial.domain.enums import SettlementStatus


class Settlement(BaseEntity):
    id: int
    amount: int
    user_id: int
    shaba: str
    shaba_owner: str
    status: SettlementStatus
    description: str | None = None

    settled_by: int | None
    settled_at: datetime | None
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    user: User | None

    @no_type_check
    @classmethod
    def create(
        cls,
        amount: int,
        user_id: int,
        shaba: str,
        shaba_owner: str,
        description: str | None = None,
    ) -> "Settlement":
        return cls(
            id=cls.get_next_id(),
            amount=amount,
            user_id=user_id,
            shaba=shaba,
            shaba_owner=shaba_owner,
            status=SettlementStatus.PENDING,
            description=description,
        )

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            amount=self.amount,
            user_id=str(self.user_id),
            shaba=self.shaba,
            shaba_owner=self.shaba_owner,
            status=SettlementStatus.resolve(self.status),
            description=self.description,
            settled_by=str(self.settled_by),
            created_at=(self.created_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S"),
            settled_at=(
                (self.settled_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if self.settled_at
                else None
            ),
            user=self.user.dumps() if self.user else None,
            **kwargs,
        )
