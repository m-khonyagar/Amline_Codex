from datetime import datetime

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from crm.domain.entities.file_source import FileSource
from crm.domain.enums import FileStatus, RealtorType, Specialization
from shared.domain.entities.city import City


class RealtorFile(BaseEntity):
    id: int
    file_status: FileStatus | None  # وضعیت فایل
    assigned_to: int | None  # کارشناس فایل
    file_source_id: int | None  # منبع فایل
    description: str | None  # توضیح وضعیت فایل
    mobile: str  # موبایل
    full_name: str | None  # نام و نام خانوادگی
    gender: str | None  # جنسیت

    city_id: int | None  # شهر
    district_ids: list[int] | None  # محله
    regions: list[int]  # مناطق
    specialization: list[Specialization]  # تخصص
    office_name: str | None  # نام دفتر
    office_address: str | None  # آدرس دفتر
    office_phone: str | None  # شماره تلفن دفتر
    realtor_type: RealtorType | None

    file_source: FileSource | None  # منبع فایل
    assigned_to_user: User | None  # کارشناس فایل
    created_by_user: User  # کارشناس فایل
    city: City | None  # شهر

    created_by: int
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    def __init__(self, **kwargs):
        self.id = self.next_id
        for field in self.__annotations__:
            if field != "id":
                setattr(self, field, kwargs.get(field))

    @classmethod
    def create(cls, **kwargs) -> "RealtorFile":
        return cls(**kwargs)

    def dumps(self, **kwargs) -> dict:
        base_dict = dict(
            id=str(self.id),
            assigned_to=str(self.assigned_to) if self.assigned_to else None,
            created_by=str(self.created_by),
            file_source_id=str(self.file_source_id) if self.file_source_id else None,
            file_source=self.file_source.dumps() if self.file_source else None,
            assigned_to_user=self.assigned_to_user.short_dumps() if self.assigned_to_user else None,
            created_by_user=self.created_by_user.short_dumps(),
            city=self.city.dumps() if self.city else None,
            district_ids=[str(district_id) for district_id in self.district_ids] if self.district_ids else [],
            city_id=str(self.city_id) if self.city_id else None,
            **kwargs,
        )
        return {
            **base_dict,
            **{field: getattr(self, field) for field in self.__annotations__ if field not in base_dict.keys()},
        }

    def update(self, **kwargs):
        for field in self.__annotations__:
            if field != "id" and field in kwargs:
                setattr(self, field, kwargs[field])
