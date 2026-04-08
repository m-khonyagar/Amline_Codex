from datetime import datetime

from account.domain.enums import UserRole
from core.base.base_entity import BaseEntity
from core.exceptions import ValidationException
from core.translates import validation_trans
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


class Property(BaseEntity):
    id: int
    owner_user_id: int
    owner_user_role: UserRole

    # Specifications
    property_type: PropertyType | None  # نوع و کاربری ملک
    deed_status: PropertyDeedStatus | None  # وضعیت سند ملک
    deed_image_file_ids: list[int]  # تصاویر سند
    city_id: int | None  # شهر
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

    elevator: bool  # آسانسور

    other_facilities: list[PropertyFacilitiesType]  # سایر امکانات
    description: str | None  # توضیحات

    _deed_image_files: list[dict] | None = None
    _city: dict | None = None

    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    def __init__(self, owner_user_id: int, owner_user_role: UserRole, **kwargs) -> None:
        self.id = self.next_id
        self.owner_user_id = owner_user_id
        self.owner_user_role = owner_user_role
        # self._validate(**kwargs)
        self._set(**kwargs)

    def update(self, **kwargs) -> None:
        # self._validate(**kwargs)
        self._set(**kwargs)

    @classmethod
    def create(cls, owner_user_id: int, owner_user_role: UserRole, **kwargs) -> "Property":
        return cls(id=cls.get_next_id(), owner_user_id=owner_user_id, owner_user_role=owner_user_role, **kwargs)

    @property
    def deed_image_files(self) -> list[dict] | None:
        if self.deed_image_file_ids is None or self.deed_image_file_ids == []:
            return []
        if self._deed_image_files is None and self.deed_image_file_ids:
            return [{"id": str(file_id), "url": None} for file_id in self.deed_image_file_ids]
        return self._deed_image_files

    @deed_image_files.setter
    def deed_image_files(self, value: list[dict] | None) -> None:
        self._deed_image_files = value

    @property
    def city(self) -> dict | None:
        if self.city_id is None:
            return None
        if self._city is None and self.city_id:
            return {"id": str(self.city_id)}
        return self._city

    @city.setter
    def city(self, value: dict | None) -> None:
        self._city = value

    @property
    def owner(self) -> dict:
        return {"id": str(self.owner_user_id), "role": self.owner_user_role.value}

    def validate_data(self, **kwargs) -> None:
        if (area := kwargs.get("area")) is not None:
            if area <= 0:
                raise ValidationException(
                    validation_trans.invalid_property_area,
                    context={"message": "Area must be greater than 0."},
                )

        if postal_code := kwargs.get("postal_code"):
            self.validate_postal_code(postal_code)

        parking = kwargs.get("parking", self.parking)
        self._validate_parking_information(
            parking=parking,
            parking_number=kwargs.get("parking_number", self.parking_number if parking else None),
        )

        landline = kwargs.get("landline", self.landline)
        self._validate_landline_information(
            landline=landline,
            landline_number=kwargs.get("landline_number", self.landline_number if landline else None),
        )

        storage_room = kwargs.get("storage_room", self.storage_room)
        self._validate_storage_room_information(
            storage_room=storage_room,
            storage_room_number=kwargs.get("storage_room_number", self.storage_room_number if storage_room else None),
            storage_room_area=kwargs.get("storage_room_area", self.storage_room_area if storage_room else None),
        )

    def _set(self, **kwargs) -> None:
        for key, value in kwargs.items():
            setattr(self, key, value)

    def dumps(self, **_) -> dict:
        return {
            "id": str(self.id),
            "owner": {"id": str(self.owner_user_id), "role": self.owner_user_role},
            "property_type": self.property_type,
            "deed_status": self.deed_status,
            "deed_image_files": self.deed_image_files,
            "city": self.city,
            "registration_area": self.registration_area,
            "main_register_number": self.main_register_number,
            "sub_register_number": self.sub_register_number,
            "postal_code": self.postal_code,
            "address": self.address,
            "area": self.area,
            "build_year": str(self.build_year) if self.build_year else None,
            "is_rebuilt": self.is_rebuilt,
            "structure_type": self.structure_type,
            "facade_types": [facade for facade in self.facade_types] if self.facade_types else [],
            "direction_type": self.direction_type,
            "flooring_types": [flooring for flooring in self.flooring_types] if self.flooring_types else [],
            "restroom_type": self.restroom_type,
            "heating_system_types": [hst for hst in self.heating_system_types] if self.heating_system_types else [],
            "cooling_system_types": [cst for cst in self.cooling_system_types] if self.cooling_system_types else [],
            "kitchen_type": self.kitchen_type,
            "water_supply_type": self.water_supply_type,
            "electricity_supply_type": self.electricity_supply_type,
            "gas_supply_type": self.gas_supply_type,
            "sewage_supply_type": self.sewage_supply_type,
            "number_of_rooms": self.number_of_rooms,
            "parking": self.parking,
            "parking_number": self.parking_number,
            "landline": self.landline,
            "landline_number": self.landline_number,
            "storage_room": self.storage_room,
            "storage_room_number": self.storage_room_number,
            "storage_room_area": self.storage_room_area,
            "elevator": self.elevator,
            "electricity_bill_id": self.electricity_bill_id,
            "other_facilities": [of for of in self.other_facilities] if self.other_facilities else [],
            "description": self.description,
        }

    def _validate_parking_information(self, parking: bool | None, parking_number: int | None) -> None:
        if parking_number and parking_number < 1:
            raise ValidationException(
                validation_trans.invalid_property_parking_information,
                context={"message": "Parking number must be greater than 0."},
            )
        if (parking and not parking_number) or (parking_number and not parking):
            raise ValidationException(
                validation_trans.invalid_property_parking_information,
                context={"message": "Parking number must match parking availability."},
            )

    def _validate_landline_information(self, landline: bool | None, landline_number: list[str] | None) -> None:
        if (landline and not landline_number) or (landline_number and landline is False):
            raise ValidationException(
                validation_trans.invalid_property_landline_information,
                context={"message": "Landline number must match landline availability."},
            )
        if landline_number:
            for s_landline in landline_number:
                if s_landline and not s_landline.isdigit():
                    raise ValidationException(
                        validation_trans.invalid_property_landline_information,
                        context={"message": "Landline number must be numeric."},
                    )

    def _validate_storage_room_information(
        self, storage_room: bool | None, storage_room_number: int | None, storage_room_area: float | None
    ) -> None:
        if storage_room_number and storage_room_number < 1:
            raise ValidationException(
                validation_trans.invalid_property_storage_room_information,
                context={"message": "Storage room number must be greater than 0."},
            )
        if storage_room_area and storage_room_area < 1:
            raise ValidationException(
                validation_trans.invalid_property_storage_room_information,
                context={"message": "Storage room area must be greater than 0."},
            )
        if (storage_room and not storage_room_number) or (storage_room_number and not storage_room):
            raise ValidationException(
                validation_trans.invalid_property_storage_room_information,
                context={"message": "Storage room number must match storage room availability."},
            )

        if (storage_room and storage_room_area is None) or (storage_room_area is not None and not storage_room):
            raise ValidationException(
                validation_trans.invalid_property_storage_room_information,
                context={"message": "Storage room area must match storage room availability."},
            )

    def validate_postal_code(self, postal_code: str) -> None:
        if not postal_code.isdigit() or len(postal_code) != 10:
            raise ValidationException(
                validation_trans.invalid_postal_code,
                context={"message": "Postal code must be numeric and exactly 10 digits long."},
            )

    @property
    def specifications_completed(self) -> bool:
        required_fields = [
            self.property_type,
            self.deed_status,
            self.city_id,
            self.registration_area,
            self.address,
        ]
        if not self.deed_image_file_ids:
            return False
        return all(field is not None for field in required_fields)

    @property
    def details_completed(self) -> bool:
        required_fields = [self.area, self.build_year, self.structure_type, self.direction_type]
        return all(field is not None for field in required_fields)

    @property
    def facilities_completed(self) -> bool:
        required_fields = [
            self.restroom_type,
            self.kitchen_type,
            self.water_supply_type,
            self.electricity_supply_type,
            self.gas_supply_type,
            self.sewage_supply_type,
            self.number_of_rooms,
        ]
        return all(field is not None for field in required_fields)
