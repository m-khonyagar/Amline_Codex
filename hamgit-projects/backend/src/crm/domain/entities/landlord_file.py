from datetime import date, datetime

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from crm.domain.entities.file_source import FileSource
from crm.domain.enums import FileStatus, ListingType, MonopolyStatus, SalePaymentMethod
from shared.domain.entities.city import City
from shared.domain.entities.district import District
from shared.domain.enums import (
    OccupancyStatus,
    PropertyCharacteristicType,
    PropertyCoolingSystemType,
    PropertyDeedStatus,
    PropertyFacilitiesType,
    PropertyFlooringType,
    PropertyHeatingSystemType,
    PropertyKitchenType,
    PropertyParkingType,
    PropertyRestroomType,
    PropertyType,
)


class LandlordFile(BaseEntity):
    # file info
    id: int
    listing_type: ListingType  # نوع لیستینگ
    file_status: FileStatus  # وضعیت فایل
    assigned_to: int | None  # کارشناس فایل
    file_source_id: int  # منبع فایل
    is_realtor: bool | None  # آیا موجر املاک است
    description: str | None  # توضیح وضعیت فایل

    # personal info
    mobile: str  # موبایل موجر
    second_mobile: str | None  # موبایل دوم موجر
    full_name: str  # نام و نام خانوادگی
    gender: str  # جنسیت

    # location info
    city_id: int | None  # شهر
    district_id: int | None  # محله
    region: int | None  # منطقه
    address: str | None  # توضیحات آدرس
    street: str | None  # خیابان

    # rent info
    rent: int  # اجاره
    deposit: int  # رهن
    dynamic_amount: bool  # مبلغ شناور
    min_rent: int | None  # اجاره حداقل
    max_rent: int | None  # اجاره حداکثر
    min_deposit: int | None  # رهن حداقل
    max_deposit: int | None  # رهن حداکثر

    # sale info
    sale_price: int | None  # قیمت فروش
    sale_payment_method: SalePaymentMethod | None  # نحوه پرداخت
    number_of_owners: int | None  # تعداد صاحبان
    handover_date: str | None  # تاریخ تحویل ملک

    # property
    property_type: PropertyType | None  # نوع و کاربری ملک
    room_count: int | None  # تعداد اتاق
    area: float | None  # متراژ
    build_year: int | None  # سال ساخت

    bathroom: list[PropertyRestroomType]  # سرویس بهداشتی
    heating: list[PropertyHeatingSystemType]  # گرمایش
    cooling: list[PropertyCoolingSystemType]  # سرمایش
    flooring: list[PropertyFlooringType]  # کفپوش
    kitchen: list[PropertyKitchenType]  # آشپزخانه
    other_facilities: list[PropertyFacilitiesType] | None  # سایر امکانات
    property_characteristics: list[PropertyCharacteristicType]  # ویژگی های ملک
    parking_type: PropertyParkingType | None  # نوع پارکینگ
    parking_count: int | None  # تعداد پارکینگ
    occupancy_status: OccupancyStatus | None  # وضعیت مسکونی
    deed_status: PropertyDeedStatus | None  # وضعیت سند ملک

    max_tenants: int | None  # حداکثر تعداد مستاجر
    elevator: bool | None  # آسانسور
    storage: bool | None  # انباری
    renovated: bool | None  # بازسازی شده

    property_image_file_ids: list[int] | None  # عکس های ملک

    floor: str | None  # طبقه
    units_per_floor: str | None  # تعداد واحد برای هر طبقه
    total_floors: str | None  # تعداد طبقات

    evacuation_date: date | None  # تاریخ تخلیه
    visit_time: str | None  # زمان بازدید

    # ad info
    monopoly: MonopolyStatus | None  # وضعیت مونوپولی
    landlord_agreed_to_remove_ad: bool | None  # موافقت موجر با حذف آگهی
    reason_for_not_removing_ad: str | None  # دلیل عدم حذف آگهی
    divar_ad_link: str | None  # لینک آگهی دیوار
    eitaa_ad_link: str | None  # لینک آگهی ایتا
    ad_title: str | None  # عنوان آگهی
    published_on_amline: bool | None  # انتشار در آملاین
    amline_ad_id: int | None  # شناسه آگهی انتشار در آملاین

    # location
    latitude: float | None  # طول جغرافیایی
    longitude: float | None  # عرض جغرافیایی

    label_ids: list[int] | None  # آیدی های برچسب ها

    file_source: FileSource | None  # منبع فایل
    assigned_to_user: User  # کاربر مسئول فایل
    created_by_user: User  # کاربر ایجاد کننده فایل
    city: City | None  # شهر
    district: District | None  # محله

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
    def create(cls, **kwargs) -> "LandlordFile":
        return cls(**kwargs)

    def dumps(self, **kwargs) -> dict:
        base_dict = dict(
            id=str(self.id),
            assigned_to=str(self.assigned_to) if self.assigned_to else None,
            created_by=str(self.created_by),
            amline_ad_id=str(self.amline_ad_id) if self.amline_ad_id else None,
            file_source_id=str(self.file_source_id) if self.file_source_id else None,
            file_source=self.file_source.dumps() if self.file_source else None,
            property_image_file_ids=(
                [str(file_id) for file_id in self.property_image_file_ids] if self.property_image_file_ids else []
            ),
            label_ids=[str(label_id) for label_id in self.label_ids] if self.label_ids else [],
            assigned_to_user=self.assigned_to_user.short_dumps() if self.assigned_to_user else None,
            created_by_user=self.created_by_user.short_dumps(),
            city=self.city.dumps() if self.city else None,
            district=self.district.dumps() if self.district else None,
            city_id=str(self.city_id) if self.city_id else None,
            district_id=str(self.district_id) if self.district_id else None,
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
