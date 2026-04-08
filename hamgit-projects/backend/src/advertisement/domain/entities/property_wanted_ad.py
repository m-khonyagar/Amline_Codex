from datetime import UTC, date, datetime
from typing import no_type_check

import pytz

from advertisement.domain.enums import AdStatus, AdType
from advertisement.service_layer.dtos import UpdatePropertyWantedAdDto
from core.base.base_entity import BaseEntity
from shared.domain.enums import PropertyType


class PropertyWantedAd(BaseEntity):
    id: int
    type: AdType
    title: str
    user_id: int
    city_id: int
    districts: list[int]
    elevator: bool | None
    parking: bool | None
    storage_room: bool | None
    property_type: list[PropertyType]
    status: AdStatus
    description: str
    min_size: int
    room_count: int | None
    tenant_deadline: date | None
    created_by_admin: bool
    # ----------------rent------------------#
    max_deposit: int | None
    max_rent: int | None
    # ----------------sale------------------#
    sale_price: int | None
    construction_year: int | None
    # --------------------------------------#
    created_by: int
    accepted_by: int | None
    accepted_at: datetime | None
    rejected_at: datetime | None
    created_at: datetime | None
    updated_at: datetime | None
    deleted_at: datetime | None

    is_reported: bool = False
    report_description: str | None

    user: dict = {}
    city: dict = {}
    districts_list: list[dict] = []

    def __init__(
        self,
        type: AdType,
        title: str,
        user_id: int,
        city_id: int,
        districts: list[int],
        property_type: list[PropertyType],
        status: AdStatus,
        description: str,
        min_size: int,
        room_count: int | None,
        created_by_admin: bool,
        max_deposit: int | None,
        max_rent: int | None,
        sale_price: int | None,
        construction_year: int | None,
        created_by: int,
        accepted_by: int | None,
        accepted_at: datetime | None,
        rejected_at: datetime | None,
        created_at: datetime | None = None,
        updated_at: datetime | None = None,
        deleted_at: datetime | None = None,
        elevator: bool | None = None,
        storage_room: bool | None = None,
        parking: bool | None = None,
        is_reported: bool = False,
        report_description: str | None = None,
        user: dict = {},
        city: dict = {},
        districts_list: list[dict] = [],
        id: int | None = None,
        tenant_deadline: date | None = None,
    ):
        self.type = type
        self.title = title
        self.user_id = user_id
        self.user = user
        self.city_id = city_id
        self.city = city
        self.districts = districts
        self.districts_list = districts_list
        self.elevator = elevator
        self.storage_room = storage_room
        self.parking = parking
        self.property_type = property_type
        self.status = AdStatus.PENDING
        self.description = description
        self.min_size = min_size
        self.room_count = room_count
        self.created_by_admin = created_by_admin
        self.status = status
        self.max_deposit = max_deposit
        self.max_rent = max_rent
        self.sale_price = sale_price
        self.construction_year = construction_year
        self.created_by = created_by
        self.accepted_by = accepted_by
        self.accepted_at = accepted_at
        self.rejected_at = rejected_at
        self.created_at = created_at
        self.updated_at = updated_at
        self.deleted_at = deleted_at
        self.is_reported = is_reported
        self.report_description = report_description
        self.tenant_deadline = tenant_deadline
        if id:
            self.id = id

    @no_type_check
    @classmethod
    def create(
        cls,
        type: AdType,
        title: str,
        user_id: int,
        city_id: int,
        districts: list[int],
        description: str,
        min_size: int,
        created_by_admin: bool,
        created_by: int,
        elevator: bool,
        parking: bool,
        storage_room: bool,
        property_type: list[PropertyType],
        status: AdStatus | None = None,
        max_deposit: int | None = None,
        max_rent: int | None = None,
        sale_price: int | None = None,
        construction_year: int | None = None,
        accepted_by: int | None = None,
        accepted_at: datetime | None = None,
        rejected_at: datetime | None = None,
        room_count: int | None = 1,
        tenant_deadline: date | None = None,
    ):
        return cls(
            type=type.value,
            title=title,
            user_id=user_id,
            city_id=city_id,
            districts=districts,
            elevator=elevator,
            parking=parking,
            storage_room=storage_room,
            property_type=property_type,
            status=status or AdStatus.PENDING,
            description=description,
            min_size=min_size,
            room_count=room_count,
            created_by_admin=created_by_admin,
            max_deposit=max_deposit,
            max_rent=max_rent,
            sale_price=sale_price,
            construction_year=construction_year,
            created_by=created_by,
            accepted_by=accepted_by,
            accepted_at=accepted_at,
            rejected_at=rejected_at,
            tenant_deadline=tenant_deadline,
        )

    def soft_delete(self):
        self.deleted_at = datetime.now(UTC)

    def update(self, info: UpdatePropertyWantedAdDto, **kwargs):
        self.title = info.title or self.title
        self.city_id = info.city_id or self.city_id
        self.districts = info.districts or self.districts
        self.elevator = info.elevator
        self.parking = info.parking
        self.storage_room = info.storage_room
        self.property_type = info.property_type or self.property_type
        self.description = info.description or self.description
        self.min_size = info.min_size or self.min_size
        self.room_count = info.room_count or self.room_count
        self.tenant_deadline = info.tenant_deadline or self.tenant_deadline
        self.created_by_admin = kwargs.get("created_by_admin") or self.created_by_admin
        self.max_deposit = info.max_deposit or self.max_deposit
        self.max_rent = info.max_rent or self.max_rent
        self.sale_price = info.sale_price or self.sale_price
        self.construction_year = info.construction_year or self.construction_year
        self.created_by = kwargs.get("created_by") or self.created_by
        self.updated_at = datetime.now(UTC)

    def dumps(self, **kwargs) -> dict:
        user: dict = self.user.get("user", {}) if self.user else {}
        return dict(
            id=str(self.id),
            type=self.type,
            title=self.title,
            user_id=str(self.user_id),
            nick_name=user.get("nick_name", None) if self.user else None,
            mobile=self.user.get("mobile") or (user.get("mobile")) if (self.user or user) else None,
            city_id=str(self.city_id),
            city=self.city,
            districts_list=(
                self.districts_list if self.districts_list and self.districts_list[0]["id"] is not None else []
            ),
            elevator=self.elevator,
            parking=self.parking,
            storage_room=self.storage_room,
            property_type=[PropertyType.resolve(p) for p in self.property_type],
            status=AdStatus.resolve(self.status),
            description=self.description,
            min_size=self.min_size,
            room_count=self.room_count,
            tenant_deadline=self.tenant_deadline,
            created_by_admin=self.created_by_admin,
            max_deposit=self.max_deposit,
            max_rent=self.max_rent,
            sale_price=self.sale_price,
            construction_year=str(self.construction_year),
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
