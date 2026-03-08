from dataclasses import dataclass
from datetime import date

from advertisement.domain.enums import AdStatus, AdType
from advertisement.entrypoints.request_models import CreatePropertyForAdRequest
from core.base.base_dto import BaseDto
from shared.domain.enums import PropertyType

# --------------------------property-wanted-ads--------------------------#


@dataclass
class CreatePropertyWantedAdDto(BaseDto):
    type: AdType
    title: str
    city_id: int
    min_size: int
    description: str
    room_count: int
    property_type: list[PropertyType]
    districts: list[int] | None
    elevator: bool = False
    parking: bool = False
    storage_room: bool = False
    max_rent: int | None = None
    sale_price: int | None = None
    max_deposit: int | None = None
    construction_year: int | None = None
    tenant_deadline: date | None = None


@dataclass
class CreateAdminPropertyWantedAdDto(BaseDto):
    type: AdType
    title: str
    city_id: int
    min_size: int
    description: str
    room_count: int
    mobile: str
    property_type: list[PropertyType]
    districts: list[int]
    elevator: bool = False
    parking: bool = False
    storage_room: bool = False
    max_rent: int | None = None
    sale_price: int | None = None
    max_deposit: int | None = None
    construction_year: int | None = None
    tenant_deadline: date | None = None


@dataclass
class UpdatePropertyWantedAdDto(BaseDto):
    title: str
    property_wanted_ad_id: int | None
    city_id: int | None
    min_size: int | None
    max_rent: int | None
    sale_price: int | None
    max_deposit: int | None
    room_count: int | None
    description: str | None
    construction_year: int | None
    districts: list[int] | None
    property_type: list[PropertyType] | None
    elevator: bool
    parking: bool
    storage_room: bool
    tenant_deadline: date | None


# --------------------------property-ads--------------------------#


@dataclass
class CreateAdminPropertyAdDto(BaseDto):
    mobile: str
    type: AdType
    title: str
    description: str
    city_id: int
    district_id: int
    location: dict
    property_info: CreatePropertyForAdRequest
    image_file_ids: list[int]
    deposit_amount: int | None = None
    rent_amount: int | None = None
    sale_price: int | None = None
    dynamic_amounts: bool | None = None


@dataclass
class CreatePropertyAdDto(BaseDto):
    type: AdType
    title: str
    description: str
    city_id: int
    district_id: int
    location: dict
    property_info: CreatePropertyForAdRequest
    image_file_ids: list[int] | None = None
    deposit_amount: int | None = None
    rent_amount: int | None = None
    sale_price: int | None = None
    dynamic_amounts: bool | None = None


@dataclass
class UpdatePropertyAdDto(BaseDto):
    property_ad_id: int
    title: str
    description: str
    city_id: int
    district_id: int
    location: dict
    property_info: CreatePropertyForAdRequest
    image_file_ids: list[int]
    deposit_amount: int | None = None
    rent_amount: int | None = None
    sale_price: int | None = None
    dynamic_amounts: bool | None = None


# --------------------------swap-ads--------------------------#
@dataclass
class CreateSwapAdDto(BaseDto):
    title: str
    have: str
    want: str
    price: int


@dataclass
class CreateAdminSwapAdDto(BaseDto):
    title: str
    have: str
    want: str
    price: int
    mobile: str
    nick_name: str | None = None


@dataclass
class UpdateSwapAdDto(BaseDto):
    swap_ad_id: int | None = None
    title: str | None = None
    have: str | None = None
    want: str | None = None
    price: int | None = None
    status: AdStatus | None = None


@dataclass
class CreateVisitRequestDto(BaseDto):
    advertisement_id: int


@dataclass
class AcceptVisitRequestDto(BaseDto):
    advertisement_id: int
    description: str | None = None


@dataclass
class RejectVisitRequestDto(BaseDto):
    advertisement_id: int
    description: str | None = None
