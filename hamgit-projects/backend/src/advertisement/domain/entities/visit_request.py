from datetime import datetime

import pytz

from advertisement.domain.entities.property_ad import PropertyAd
from advertisement.domain.enums import VisitRequestStatus
from core.base.base_entity import BaseEntity


class VisitRequest(BaseEntity):
    id: int
    status: VisitRequestStatus
    visit_date: datetime | None

    requester_mobile: str
    requester_user_id: int

    owner_mobile: str
    owner_user_id: int
    advertisement_id: int

    description: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    deleted_at: datetime | None = None
    accepted_at: datetime | None = None
    rejected_at: datetime | None = None
    accepted_by: int | None = None
    rejected_by: int | None = None

    advertisement: PropertyAd | None = None

    def __init__(
        self,
        id: int,
        status: VisitRequestStatus,
        visit_date: datetime | None,
        requester_mobile: str,
        requester_user_id: int,
        owner_mobile: str,
        owner_user_id: int,
        advertisement_id: int,
        created_at: datetime | None = None,
        updated_at: datetime | None = None,
        deleted_at: datetime | None = None,
        accepted_at: datetime | None = None,
        rejected_at: datetime | None = None,
        accepted_by: int | None = None,
        rejected_by: int | None = None,
        description: str | None = None,
    ):
        self.id = id
        self.status = status
        self.visit_date = visit_date
        self.requester_mobile = requester_mobile
        self.requester_user_id = requester_user_id
        self.owner_mobile = owner_mobile
        self.owner_user_id = owner_user_id
        self.advertisement_id = advertisement_id
        self.created_at = created_at
        self.updated_at = updated_at
        self.deleted_at = deleted_at
        self.accepted_at = accepted_at
        self.rejected_at = rejected_at
        self.accepted_by = accepted_by
        self.rejected_by = rejected_by
        self.description = description

    @classmethod
    def create(
        cls,
        requester_mobile: str,
        requester_user_id: int,
        owner_mobile: str,
        owner_user_id: int,
        advertisement_id: int,
    ) -> "VisitRequest":
        return cls(
            id=cls.get_next_id(),
            visit_date=None,
            status=VisitRequestStatus.PENDING,
            requester_mobile=requester_mobile,
            requester_user_id=requester_user_id,
            owner_mobile=owner_mobile,
            owner_user_id=owner_user_id,
            advertisement_id=advertisement_id,
        )

    def accept(self, accepted_by: int, visit_date: datetime, description: str | None = None) -> None:
        self.status = VisitRequestStatus.ACCEPTED
        self.accepted_at = datetime.now()
        self.accepted_by = accepted_by
        self.visit_date = visit_date
        self.description = description

    def reject(self, rejected_by: int, description: str | None = None) -> None:
        self.status = VisitRequestStatus.REJECTED
        self.rejected_at = datetime.now()
        self.rejected_by = rejected_by
        self.description = description

    def dumps(self, **kwargs) -> dict:
        return {
            "id": str(self.id),
            "status": VisitRequestStatus.resolve(self.status),
            "visit_date": self.visit_date.strftime("%Y-%m-%d %H:%M:%S") if self.visit_date else None,
            "requester_mobile": self.requester_mobile,
            "requester_user_id": str(self.requester_user_id),
            "owner_mobile": self.owner_mobile,
            "owner_user_id": str(self.owner_user_id),
            "advertisement_id": str(self.advertisement_id),
            "description": self.description,
            "created_at": (
                (self.created_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if self.created_at
                else None
            ),
            "updated_at": (
                (self.updated_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if self.updated_at
                else None
            ),
            "accepted_at": (
                (self.accepted_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if self.accepted_at
                else None
            ),
            "rejected_at": (
                (self.rejected_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if self.rejected_at
                else None
            ),
            "property_ad": self.advertisement.dumps() if self.advertisement else None,
            **kwargs,
        }
