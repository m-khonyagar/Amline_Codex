from datetime import UTC, datetime

import pytz

from account.domain.entities.user import User
from advertisement.domain.enums import AdStatus
from advertisement.service_layer.dtos import UpdateSwapAdDto
from core.base.base_entity import BaseEntity


class SwapAd(BaseEntity):
    id: int
    title: str
    have: str
    want: str
    price: int
    user_id: int
    status: AdStatus
    created_by_admin: bool
    created_by: int
    accepted_by: int | None
    accepted_at: datetime | None
    rejected_at: datetime | None
    created_at: datetime | None
    updated_at: datetime | None
    deleted_at: datetime | None

    is_reported: bool = False
    report_description: str | None

    user: User

    def __init__(
        self,
        id: int,
        title: str,
        have: str,
        want: str,
        price: int,
        user_id: int,
        status: AdStatus,
        created_by_admin: bool,
        created_by: int,
        accepted_by: int | None,
        accepted_at: datetime | None = None,
        rejected_at: datetime | None = None,
        created_at: datetime | None = None,
        updated_at: datetime | None = None,
        deleted_at: datetime | None = None,
        is_reported: bool = False,
        report_description: str | None = None,
    ):
        self.id = id
        self.title = title
        self.have = have
        self.want = want
        self.price = price
        self.user_id = user_id
        self.status = status
        self.created_by_admin = created_by_admin
        self.created_by = created_by
        self.accepted_by = accepted_by
        self.accepted_at = accepted_at
        self.rejected_at = rejected_at
        self.created_at = created_at
        self.updated_at = updated_at
        self.deleted_at = deleted_at
        self.is_reported = is_reported
        self.report_description = report_description

    @classmethod
    def create(
        cls,
        title: str,
        have: str,
        want: str,
        price: int,
        user_id: int,
        status: AdStatus,
        created_by_admin: bool,
        created_by: int,
        accepted_by: int | None,
    ):
        return cls(
            id=cls.get_next_id(),
            title=title,
            have=have,
            want=want,
            price=price,
            user_id=user_id,
            status=status,
            created_by_admin=created_by_admin,
            created_by=created_by,
            accepted_by=accepted_by,
        )

    def update(self, dto: UpdateSwapAdDto):
        self.title = dto.title or self.title
        self.have = dto.have or self.have
        self.want = dto.want or self.want
        self.price = dto.price or self.price
        self.status = dto.status or self.status
        self.updated_at = datetime.now(UTC)

    def soft_delete(self):
        self.deleted_at = datetime.now(UTC)

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            title=self.title,
            have=self.have,
            want=self.want,
            price=self.price,
            user_id=str(self.user_id),
            status=AdStatus.resolve(self.status),
            created_by=str(self.created_by),
            created_by_admin=self.created_by_admin,
            mobile=self.user.mobile if self.user else None,
            nick_name=self.user.nick_name if self.user else None,
            accepted_at=(
                (self.accepted_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if (isinstance(self.accepted_at, datetime))
                else None
            ),
            rejected_at=(
                (self.rejected_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if (isinstance(self.rejected_at, datetime))
                else None
            ),
            **kwargs,
        )
