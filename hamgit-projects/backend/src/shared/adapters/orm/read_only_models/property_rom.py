from datetime import datetime

import sqlalchemy as sa

from account.domain.enums import UserRole
from core.base.base_read_only_model import BaseROM
from core.database import SQLALCHEMY_READONLY_REGISTRY
from shared.adapters.orm.read_only_models.city_rom import CityROM
from shared.domain.enums import (
    PropertyCoolingSystemType,
    PropertyDeedStatus,
    PropertyDirectionType,
    PropertyFacadeType,
    PropertyFacilitiesType,
    PropertyFlooringType,
    PropertyHeatingSystemType,
    PropertyKitchenType,
    PropertyRestroomType,
    PropertyStructureType,
    PropertySupplyType,
    PropertyType,
)


class PropertyROM(BaseROM):
    id: int
    owner_user_id: int
    owner_user_role: UserRole

    # Specifications
    property_type: PropertyType | None  # نوع و کاربری ملک
    deed_status: PropertyDeedStatus | None  # وضعیت سند ملک
    deed_image_file_ids: list[int]  # تصاویر سند
    city_id: int | None  # شهر
    city: CityROM | None  # شهر
    registration_area: str | None  # حوزه ثبتی
    main_register_number: int | None  # پلاک ثبتی اصلی
    sub_register_number: int | None  # پلاک ثبتی فرعی
    electricity_bill_id: str | None
    postal_code: str | None  # کد پستی
    address: str | None  # آدرس

    # Details
    area: float | None  # مساحت
    build_year: int | None  # سال ساخت
    structure_type: PropertyStructureType | None  # نوع اسکلت ساختمان
    facade_types: list[PropertyFacadeType]  # نوع نمای ساختمان
    direction_type: PropertyDirectionType | None  # سمت واحد
    flooring_types: list[PropertyFlooringType]  # نوع کفپوش ساختمان
    is_rebuilt: bool | None  # آیا ملک بازسازی شده است؟

    # Facilities
    restroom_type: PropertyRestroomType | None  # نوع سرویس بهداشتی
    heating_system_types: list[PropertyHeatingSystemType]  # نوع سیستم گرمایشی
    cooling_system_types: list[PropertyCoolingSystemType]  # نوع سیستم سرمایشی
    kitchen_type: PropertyKitchenType | None  # نوع آشپزخانه

    water_supply_type: PropertySupplyType | None  # آب لوله کشی
    electricity_supply_type: PropertySupplyType | None  # برق شهری
    gas_supply_type: PropertySupplyType | None  # گاز شهری
    sewage_supply_type: PropertySupplyType | None  # سیستم فاضلاب
    number_of_rooms: int | None  # تعداد اتاق

    parking: bool  # پارکینک
    parking_number: int | None  # شماره پارکینک

    landline: bool  # خط تلفن ثابت
    landline_number: list[str] | None  # شماره خط تلفن ثابت

    storage_room: bool  # انباری
    storage_room_number: int | None  # شماره انباری
    storage_room_area: float | None  # متراژ انباری

    other_facilities: list[PropertyFacilitiesType]  # سایر امکانات
    description: str | None  # توضیحات

    deleted_at: datetime | None

    def dumps(self, deed_images: list[dict] | None = None, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            owner=dict(id=str(self.owner_user_id), role=self.owner_user_role),
            property_type=PropertyType.safe_resolve(self.property_type),
            deed_status=PropertyDeedStatus.safe_resolve(self.deed_status),
            deed_image_files=(
                deed_images if deed_images else [{"id": str(image_id)} for image_id in self.deed_image_file_ids]
            ),
            city=self.city.dumps() if self.city else None,
            registration_area=self.registration_area,
            main_register_number=self.main_register_number,
            sub_register_number=self.sub_register_number,
            postal_code=self.postal_code,
            address=self.address,
            area=self.area,
            build_year=str(self.build_year) if self.build_year else None,
            is_rebuilt=self.is_rebuilt,
            structure_type=PropertyStructureType.safe_resolve(self.structure_type),
            facade_types=[PropertyFacadeType.resolve(facade) for facade in self.facade_types],
            direction_type=PropertyDirectionType.safe_resolve(self.direction_type),
            flooring_types=[PropertyFlooringType.resolve(flooring) for flooring in self.flooring_types],
            restroom_type=PropertyRestroomType.safe_resolve(self.restroom_type),
            heating_system_types=[PropertyHeatingSystemType.resolve(heating) for heating in self.heating_system_types],
            cooling_system_types=[PropertyCoolingSystemType.resolve(cooling) for cooling in self.cooling_system_types],
            kitchen_type=PropertyKitchenType.safe_resolve(self.kitchen_type),
            water_supply_type=PropertySupplyType.safe_resolve(self.water_supply_type),
            electricity_supply_type=PropertySupplyType.safe_resolve(self.electricity_supply_type),
            gas_supply_type=PropertySupplyType.safe_resolve(self.gas_supply_type),
            sewage_supply_type=PropertySupplyType.safe_resolve(self.sewage_supply_type),
            number_of_rooms=self.number_of_rooms,
            parking=self.parking,
            parking_number=self.parking_number,
            landline=self.landline,
            landline_number=self.landline_number,
            storage_room=self.storage_room,
            storage_room_number=self.storage_room_number,
            storage_room_area=self.storage_room_area,
            other_facilities=[PropertyFacilitiesType.resolve(facility) for facility in self.other_facilities],
            description=self.description,
            electricity_bill_id=self.electricity_bill_id,
        )


properties_rom = sa.Table(
    "properties",
    SQLALCHEMY_READONLY_REGISTRY.metadata,
    sa.Column("id", sa.BigInteger, primary_key=True),
    sa.Column("owner_user_id", sa.BigInteger, sa.ForeignKey("account.users.id"), nullable=False, index=True),
    sa.Column("owner_user_role", sa.String, nullable=False, index=True),
    #
    sa.Column("property_type", sa.String),
    sa.Column("deed_status", sa.String),
    sa.Column("deed_image_file_ids", sa.ARRAY(sa.BigInteger), nullable=False),
    sa.Column("city_id", sa.BigInteger, sa.ForeignKey("shared.cities.id"), nullable=False, index=True),
    sa.Column("registration_area", sa.String),
    sa.Column("main_register_number", sa.BigInteger, default=None),
    sa.Column("sub_register_number", sa.BigInteger, default=None),
    sa.Column("postal_code", sa.String),
    sa.Column("address", sa.String),
    #
    sa.Column("area", sa.Float),
    sa.Column("build_year", sa.Integer),
    sa.Column("is_rebuilt", sa.Boolean, default=False),
    sa.Column("structure_type", sa.String),
    sa.Column("facade_types", sa.ARRAY(sa.String), nullable=False),
    sa.Column("direction_type", sa.String),
    sa.Column("flooring_types", sa.ARRAY(sa.String), nullable=False),
    #
    sa.Column("restroom_type", sa.String),
    sa.Column("heating_system_types", sa.ARRAY(sa.String), nullable=False),
    sa.Column("cooling_system_types", sa.ARRAY(sa.String), nullable=False),
    sa.Column("kitchen_type", sa.String),
    sa.Column("water_supply_type", sa.String),
    sa.Column("electricity_supply_type", sa.String),
    sa.Column("gas_supply_type", sa.String),
    sa.Column("sewage_supply_type", sa.String),
    sa.Column("number_of_rooms", sa.Integer),
    sa.Column("parking", sa.Boolean, default=False),
    sa.Column("parking_number", sa.Integer),
    sa.Column("landline", sa.Boolean, default=False),
    sa.Column("landline_number", sa.ARRAY(sa.String)),
    sa.Column("storage_room", sa.Boolean, default=False),
    sa.Column("storage_room_number", sa.Integer),
    sa.Column("storage_room_area", sa.Float),
    sa.Column("other_facilities", sa.ARRAY(sa.String)),
    sa.Column("description", sa.String),
    sa.Column("electricity_bill_id", sa.String),
    #
    sa.Column("created_at", sa.DateTime(timezone=True), default=sa.func.now()),
    sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    sa.Column("deleted_at", sa.DateTime(timezone=True)),
    schema="shared",
)
