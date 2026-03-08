from datetime import datetime

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from crm.domain.entities.file_source import FileSource
from crm.domain.enums import FileStatus, ListingType, SalePaymentMethod
from shared.domain.entities.city import City
from shared.domain.enums import (
    PropertyCoolingSystemType,
    PropertyFacilitiesType,
    PropertyFlooringType,
    PropertyHeatingSystemType,
    PropertyRestroomType,
    PropertyType,
)


class TenantFile(BaseEntity):
    # file info
    id: int
    listing_type: ListingType  # نوع لیستینگ
    file_status: FileStatus  # وضعیت فایل
    assigned_to: int | None  # کارشناس فایل
    file_source_id: int  # منبع فایل
    is_realtor: bool | None  # آیا موجر املاک است
    description: str | None  # توضیح وضعیت فایل

    # personal info
    mobile: str  # موبایل مستاجر
    full_name: str  # نام و نام خانوادگی
    gender: str  # جنسیت
    family_members_count: int | None  # تعداد خانواده
    children_ages_description: str | None  # توضیح سنین فرزندان
    tenant_deadline: str | None  # مهلت مستاجر
    job: str | None  # شغل

    # sale info
    budget: int | None  # بودجه
    sale_payment_method: SalePaymentMethod | None  # نحوه پرداخت
    expected_date: str | None  # تاریخ مورد انتظار

    # rent info
    rent: int | None  # اجاره
    deposit: int | None  # رهن
    dynamic_amount: bool  # مبلغ شناور
    min_rent: int | None  # اجاره حداقل
    max_rent: int | None  # اجاره حداکثر
    min_deposit: int | None  # رهن حداقل
    max_deposit: int | None  # رهن حداکثر
    payment_method: str | None  # نحوه پرداخت

    # location info
    city_id: int | None  # شهر
    district_ids: list[int] | None  # محله
    regions: list[int]  # مناطق
    address_description: str | None  # توضیحات آدرس

    # property info
    property_type: PropertyType | None  # نوع و کاربری ملک
    room_count: int | None  # تعداد اتاق
    area: float | None  # متراژ
    build_year: int | None  # سال ساخت
    bathroom: list[PropertyRestroomType] | None  # سرویس بهداشتی
    heating: list[PropertyHeatingSystemType] | None  # گرمایش
    cooling: list[PropertyCoolingSystemType] | None  # سرمایش
    flooring: list[PropertyFlooringType] | None  # کفپوش
    other_facilities: list[PropertyFacilitiesType] | None  # سایر امکانات
    elevator: bool | None  # آسانسور
    storage: bool | None  # انباری
    parking: bool | None  # پارکینگ
    eitaa_ad_link: str | None  # لینک آگهی ایتا
    ad_title: str | None  # عنوان آگهی
    published_on_amline: bool | None  # انتشار در آملاین
    amline_ad_id: int | None  # شناسه آگهی انتشار در آملاین

    label_ids: list[int] | None  # آیدی های برچسب ها

    file_source: FileSource | None  # منبع فایل
    assigned_to_user: User  # کاربر مسئول فایل
    created_by_user: User  # کاربر ایجاد کننده فایل
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
    def create(cls, **kwargs) -> "TenantFile":
        return cls(**kwargs)

    def dumps(self, **kwargs) -> dict:
        base_dict = dict(
            id=str(self.id),
            assigned_to=str(self.assigned_to) if self.assigned_to else None,
            created_by=str(self.created_by),
            file_source_id=str(self.file_source_id) if self.file_source_id else None,
            file_source=self.file_source.dumps() if self.file_source else None,
            label_ids=[str(label_id) for label_id in self.label_ids] if self.label_ids else [],
            assigned_to_user=self.assigned_to_user.short_dumps() if self.assigned_to_user else None,
            created_by_user=self.created_by_user.short_dumps(),
            city=self.city.dumps() if self.city else None,
            district_ids=[str(district_id) for district_id in self.district_ids] if self.district_ids else [],
            city_id=str(self.city_id) if self.city_id else None,
            amline_ad_id=str(self.amline_ad_id) if self.amline_ad_id else None,
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
