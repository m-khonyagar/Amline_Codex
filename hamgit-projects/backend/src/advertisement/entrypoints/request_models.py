from datetime import date

from pydantic import BaseModel, Field, field_validator

from advertisement.domain.enums import AdCategory, AdStatus, AdType, PropertyAdCategory
from core.exceptions import ValidationException
from core.translates import validation_trans
from shared.domain.enums import PropertyFacilitiesType, PropertyType


class GetWantedAdFilter(BaseModel):
    type: AdType | None = None
    city: int | None = None
    user_city_ids: list[int] | None = None
    min_meter: int | None = None
    max_meter: int | None = None
    min_deposit: int | None = None
    max_deposit: int | None = None
    min_rent: int | None = None
    max_rent: int | None = None
    min_sale_price: int | None = None
    max_sale_price: int | None = None
    room_count: int | None = None
    min_construction_year: str | int | None = None
    max_construction_year: str | int | None = None
    districts: list[int] = []
    elevator: bool
    parking: bool
    storage_room: bool
    property_type: list[PropertyType] = []
    order_by_cheapest: bool | None = None
    is_reported: bool | None = None
    status: AdStatus | None = None

    class Config:
        populate_by_name = True


class GetPropertyAdFilter(BaseModel):
    type: AdType | None = None
    category: PropertyAdCategory | None = None
    city: int | None = None
    user_city_ids: list[int] | None = None
    min_meter: int | None = None
    max_meter: int | None = None
    min_deposit: int | None = None
    max_deposit: int | None = None
    min_rent: int | None = None
    max_rent: int | None = None
    min_sale_price: int | None = None
    max_sale_price: int | None = None
    room_count: int | None = None
    min_construction_year: str | int | None = None
    max_construction_year: str | int | None = None
    districts: list[int] = []
    elevator: bool
    parking: bool
    storage_room: bool
    property_type: list[PropertyType] = []
    order_by_cheapest: bool | None = None
    is_reported: bool | None = None
    status: AdStatus | None = None

    class Config:
        populate_by_name = True


# --------------------------swap-ads--------------------------#


class CreateSwapAdRequest(BaseModel):
    title: str
    have: str
    want: str
    price: int

    def to_dict(self):
        return self.model_dump(exclude_unset=True)


class CreateAdminSwapAdRequest(BaseModel):
    title: str
    have: str
    want: str
    price: int
    mobile: str
    nick_name: str | None = None

    def to_dict(self):
        return self.model_dump(exclude_unset=True)


class UpdateSwapAdRequest(BaseModel):
    title: str | None = None
    have: str | None = None
    want: str | None = None
    price: int | None = None

    def to_dict(self):
        return self.model_dump(exclude_none=True)


# --------------------------property-wanted-ads--------------------------#


class CreateAdminPropertyWantedAdRequest(BaseModel):
    title: str
    city_id: int
    min_size: int | None = None
    mobile: str
    max_deposit: int | None = None
    max_rent: int | None = None
    sale_price: int | None = None
    construction_year: int | None = None
    description: str | None = None
    room_count: int | None = None
    districts: list[int] | None = None
    property_type: list[PropertyType]
    elevator: bool | None = None
    parking: bool | None = None
    storage_room: bool | None = None
    tenant_deadline: date | None = None
    type: AdType

    @field_validator("type")
    def ad_type_validator(cls, value, values):
        max_deposit = values.data.get("max_deposit")
        max_rent = values.data.get("max_rent")
        sale_price = values.data.get("sale_price")

        if value == AdType.FOR_RENT:
            if not any([max_deposit, max_rent]):
                raise ValidationException(validation_trans.provide_max_rent_or_max_deposit_for_rent)
            values.data.pop("sale_price", None)

        elif value == AdType.FOR_SALE:
            if not any([sale_price]):
                raise ValidationException(validation_trans.provide_sale_price_for_sale)
            values.data.pop("max_deposit", None)
            values.data.pop("max_rent", None)

        return value


class CreatePropertyWantedAdRequest(BaseModel):
    title: str
    city_id: int
    min_size: int | None = None
    max_deposit: int | None = None
    max_rent: int | None = None
    sale_price: int | None = None
    construction_year: int | None = None
    description: str | None = None
    room_count: int | None = None
    districts: list[int] | None
    property_type: list[PropertyType]
    elevator: bool | None = None
    parking: bool | None = None
    storage_room: bool | None = None
    tenant_deadline: date | None = None
    type: AdType

    @field_validator("type")
    def ad_type_validator(cls, value, values):
        max_deposit = values.data.get("max_deposit")
        max_rent = values.data.get("max_rent")
        sale_price = values.data.get("sale_price")

        if value == AdType.FOR_RENT:
            if not any([max_deposit, max_rent]):
                raise ValidationException(validation_trans.provide_max_rent_or_max_deposit_for_rent)
            values.data.pop("sale_price", None)

        elif value == AdType.FOR_SALE:
            if not any([sale_price]):
                raise ValidationException(validation_trans.provide_sale_price_for_sale)
            values.data.pop("max_deposit", None)
            values.data.pop("max_rent", None)

        return value


class UpdatePropertyWantedAdRequest(BaseModel):
    title: str
    city_id: int
    min_size: int
    max_deposit: int | None = None
    max_rent: int | None = None
    sale_price: int | None = None
    construction_year: int | None = None
    description: str
    room_count: int
    districts: list[int]
    property_type: list[PropertyType]
    elevator: bool | None = None
    parking: bool | None = None
    storage_room: bool | None = None
    tenant_deadline: date | None = None


# --------------------------property-ads--------------------------#


class CreatePropertyForAdRequest(BaseModel):
    property_type: PropertyType | None = None
    area: float | None = None
    build_year: int | None = None
    is_rebuilt: bool | None = False
    number_of_rooms: int | None = None
    other_facilities: list[PropertyFacilitiesType] | None = None
    parking: bool | None = False
    landline: bool | None = False
    storage_room: bool | None = False
    elevator: bool | None = False

    def to_dict(self):
        return self.model_dump(exclude_none=True)


class CreatePropertyAdRequest(BaseModel):
    title: str
    city_id: int
    district_id: int | None = None
    property_info: CreatePropertyForAdRequest
    image_file_ids: list[int] | None = None
    location: dict | None = None
    deposit_amount: int | None = None
    rent_amount: int | None = None
    sale_price: int | None = None
    description: str | None = None
    dynamic_amounts: bool | None = None
    type: AdType

    @field_validator("type")
    def ad_type_validator(cls, value, values):
        deposit_amount = values.data.get("deposit_amount")
        rent_amount = values.data.get("rent_amount")
        sale_price = values.data.get("sale_price")

        if value == AdType.FOR_RENT:
            if not any([deposit_amount, rent_amount]):
                raise ValidationException(validation_trans.provide_max_rent_or_max_deposit_for_rent)
            values.data.pop("sale_price", None)

        elif value == AdType.FOR_SALE:
            if not sale_price:
                raise ValidationException(validation_trans.provide_sale_price_for_sale)
            values.data.pop("deposit_amount", None)
            values.data.pop("rent_amount", None)

        return value


class CreateAdminPropertyAdRequest(BaseModel):
    mobile: str
    title: str
    city_id: int
    district_id: int | None = None
    property_info: CreatePropertyForAdRequest
    image_file_ids: list[int] | None = None
    location: dict | None = None
    deposit_amount: int | None = None
    rent_amount: int | None = None
    dynamic_amounts: bool | None = None
    sale_price: int | None = None
    description: str | None = None
    type: AdType

    @field_validator("type")
    def ad_type_validator(cls, value, values):
        deposit_amount = values.data.get("deposit_amount")
        rent_amount = values.data.get("rent_amount")
        sale_price = values.data.get("sale_price")

        if value == AdType.FOR_RENT:
            if not any([deposit_amount, rent_amount]):
                raise ValidationException(validation_trans.provide_max_rent_or_max_deposit_for_rent)
            values.data.pop("sale_price", None)

        elif value == AdType.FOR_SALE:
            if not sale_price:
                raise ValidationException(validation_trans.provide_sale_price_for_sale)
            values.data.pop("deposit_amount", None)
            values.data.pop("rent_amount", None)

        return value


class UpdatePropertyAdRequest(BaseModel):
    title: str | None = None
    city_id: int | None = Field(..., gt=0)
    district_id: int | None = Field(..., gt=0)
    location: dict | None = None
    property_info: CreatePropertyForAdRequest | None = None
    image_file_ids: list[int] | None = None
    deposit_amount: int | None = None
    rent_amount: int | None = None
    sale_price: int | None = None
    description: str | None = None


class ReportAdRequest(BaseModel):
    ad_id: int
    ad_category: AdCategory
    description: str
