from core.base.base_response_model import BaseResponse
from shared.domain import enums


class FileResponseModel(BaseResponse):
    id: str
    url: str | None = None


class File_Response(BaseResponse):
    id: str
    url: str | None = None


class ProvinceResponseModel(BaseResponse):
    id: str
    name: str


class CityResponseModel(BaseResponse):
    id: str
    name: str
    province: str


class DistrictResponseModel(BaseResponse):
    name: str


class PropertyResponse(BaseResponse):
    id: str
    owner: dict
    property_type: enums.PropertyType | None
    deed_status: enums.PropertyDeedStatus | None
    deed_image_files: list[FileResponseModel] | None | list
    city: dict | None
    registration_area: str | None
    main_register_number: int | None
    sub_register_number: int | None
    postal_code: str | None
    electricity_bill_id: str | None
    address: str | None

    area: float | None
    build_year: int | str | None
    structure_type: enums.PropertyStructureType | None
    facade_types: list[enums.PropertyFacadeType] | None
    direction_type: enums.PropertyDirectionType | None
    flooring_types: list[enums.PropertyFlooringType] | None

    restroom_type: enums.PropertyRestroomType | None
    heating_system_types: list[enums.PropertyHeatingSystemType] | None
    cooling_system_types: list[enums.PropertyCoolingSystemType] | None
    kitchen_type: enums.PropertyKitchenType | None

    water_supply_type: enums.PropertySupplyType | None
    electricity_supply_type: enums.PropertySupplyType | None
    gas_supply_type: enums.PropertySupplyType | None
    sewage_supply_type: enums.PropertySupplyType | None
    number_of_rooms: int | None

    parking: bool | None
    parking_number: int | None

    landline: bool | None
    landline_number: list[str] | None

    storage_room: bool | None
    storage_room_number: int | None
    storage_room_area: float | None

    other_facilities: list[enums.PropertyFacilitiesType] | None
    description: str | None

    family_members_count: int | None
