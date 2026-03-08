from datetime import datetime
from typing import no_type_check

import pytz

from account.domain.enums import UserRole
from contract.domain.enums import PaymentType
from core.base.base_entity import BaseEntity
from core.helpers import generate_discount_code
from financial.domain.enums import DiscountType


class Discount(BaseEntity):
    id: int
    code: str
    type: DiscountType
    value: int
    starts_at: datetime | None
    ends_at: datetime | None
    is_active: bool
    usage_limit: int | None
    used_counts: int
    specified_roles: list[UserRole] | None | None
    resource_type: PaymentType | None
    created_by: int
    specified_user_phone: str | None
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime

    @no_type_check
    @classmethod
    def create(
        cls,
        type: DiscountType,
        value: int,
        created_by: int,
        resource_type: PaymentType | None = None,
        ends_at: datetime | None = None,
        starts_at: datetime | None = None,
        specified_roles: list[UserRole] | None = [],
        usage_limit: int | None = 10**5,
        prefix: str = "",
        specified_user_phone: str | None = None,
        code: str | None = None,
    ) -> "Discount":
        return cls(
            id=cls.get_next_id(),
            code=code or prefix + generate_discount_code(),
            type=type,
            value=value,
            starts_at=starts_at,
            ends_at=ends_at,
            is_active=True,
            usage_limit=usage_limit,
            specified_roles=specified_roles,
            resource_type=resource_type,
            used_counts=0,
            created_by=created_by,
            specified_user_phone=specified_user_phone,
        )

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            code=self.code,
            type=DiscountType.resolve(self.type),
            value=self.value,
            starts_at=(
                (self.starts_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if self.starts_at
                else None
            ),
            ends_at=(
                (self.ends_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if self.ends_at
                else None
            ),
            is_active=self.is_active,
            usage_limit=self.usage_limit,
            used_counts=self.used_counts,
            specified_roles=self.specified_roles,
            resource_type=PaymentType.resolve(self.resource_type) if self.resource_type else None,
            created_by=str(self.created_by),
            specified_user_phone=self.specified_user_phone,
            **kwargs,
        )
