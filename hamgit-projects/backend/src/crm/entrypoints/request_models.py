from datetime import date, datetime

from pydantic import BaseModel

from account.domain.enums import Gender
from crm.domain.enums import (
    CallStatus,
    FileConnectionInitiator,
    FileConnectionStatus,
    FileStatus,
    LabelType,
    ListingType,
    MonopolyStatus,
    PhonesEntityType,
    RealtorSharedFileSendType,
    ReportDuration,
    SalePaymentMethod,
    Specialization,
    TaskStatus,
)
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


class UpsertLandlordFileRequest(BaseModel):
    listing_type: ListingType
    file_status: FileStatus
    assigned_to: int | None = None
    file_source_id: int | None = None
    is_realtor: bool | None = None
    description: str | None = None
    mobile: str
    second_mobile: str | None = None
    full_name: str | None = None
    gender: Gender | None = None
    rent: int | None = None
    deposit: int | None = None
    dynamic_amount: bool | None = None
    min_rent: int | None = None
    max_rent: int | None = None
    min_deposit: int | None = None
    max_deposit: int | None = None
    city_id: int | None = None
    district_id: int | None = None
    region: int | None = None
    address: str | None = None
    street: str | None = None
    property_type: PropertyType | None = None
    room_count: int | None = None
    area: float | None = None
    build_year: int | None = None
    bathroom: list[PropertyRestroomType] | None = None
    heating: list[PropertyHeatingSystemType] | None = None
    cooling: list[PropertyCoolingSystemType] | None = None
    flooring: list[PropertyFlooringType] | None = None
    kitchen: list[PropertyKitchenType] | None = None
    property_characteristics: list[PropertyCharacteristicType] | None = None
    occupancy_status: OccupancyStatus | None = None
    parking_type: PropertyParkingType | None = None
    parking_count: int | None = None
    floor: str | None = None
    units_per_floor: str | None = None
    total_floors: str | None = None
    max_tenants: int | None = None
    other_facilities: list[PropertyFacilitiesType] | None = None
    elevator: bool | None = None
    storage: bool | None = None
    renovated: bool | None = None
    visit_time: str | None = None
    evacuation_date: date | None = None
    property_image_file_ids: list[int] | None = None
    monopoly: MonopolyStatus | None = None
    landlord_agreed_to_remove_ad: bool | None = None
    reason_for_not_removing_ad: str | None = None
    divar_ad_link: str | None = None
    eitaa_ad_link: str | None = None
    ad_title: str | None = None
    label_ids: list[int] | None = None
    latitude: float | None = None
    longitude: float | None = None
    sale_price: int | None = None
    sale_payment_method: SalePaymentMethod | None = None
    number_of_owners: int | None = None
    handover_date: str | None = None
    deed_status: PropertyDeedStatus | None = None

    class Config:
        use_enum_values = True


class UpsertLandlordFileBulkSingleRequest(UpsertLandlordFileRequest):
    unique_key: str


class UpsertLandlordFileBulkRequest(BaseModel):
    data: list[UpsertLandlordFileBulkSingleRequest]


class UpsertTenantFileRequest(BaseModel):
    listing_type: ListingType
    file_status: FileStatus
    assigned_to: int | None = None
    file_source_id: int | None = None
    is_realtor: bool | None = None
    description: str | None = None
    mobile: str
    full_name: str | None = None
    gender: Gender | None = None
    family_members_count: int | None = None
    children_ages_description: str | None = None
    tenant_deadline: str | None = None
    job: str | None = None
    rent: int | None = None
    deposit: int | None = None
    dynamic_amount: bool | None = None
    min_rent: int | None = None
    max_rent: int | None = None
    min_deposit: int | None = None
    max_deposit: int | None = None
    payment_method: str | None = None
    city_id: int | None = None
    district_ids: list[int] | None = None
    regions: list[int] | None = None
    address_description: str | None = None
    property_type: PropertyType | None = None
    room_count: int | None = None
    area: float | None = None
    build_year: int | None = None
    bathroom: list[PropertyRestroomType] | None = None
    heating: list[PropertyHeatingSystemType] | None = None
    cooling: list[PropertyCoolingSystemType] | None = None
    flooring: list[PropertyFlooringType] | None = None
    other_facilities: list[PropertyFacilitiesType] | None = None
    elevator: bool | None = None
    storage: bool | None = None
    parking: bool | None = None
    eitaa_ad_link: str | None = None
    ad_title: str | None = None
    label_ids: list[int] | None = None
    budget: int | None = None
    sale_payment_method: SalePaymentMethod | None = None
    expected_date: str | None = None

    class Config:
        use_enum_values = True


class UpsertTenantFileBulkSingleRequest(UpsertTenantFileRequest):
    unique_key: str


class UpsertTenantFileBulkRequest(BaseModel):
    data: list[UpsertTenantFileBulkSingleRequest]


class UpsertRealtorFileRequest(BaseModel):
    file_status: FileStatus | None = None
    assigned_to: int | None = None
    file_source_id: int | None = None
    description: str | None = None
    mobile: str
    full_name: str | None = None
    gender: Gender | None = None

    city_id: int | None = None
    district_ids: list[int] | None = None
    regions: list[int] | None = None
    specialization: list[Specialization] | None = None
    office_name: str | None = None
    office_address: str | None = None
    office_phone: str | None = None

    class Config:
        use_enum_values = True


class UpsertRealtorFileBulkSingleRequest(UpsertRealtorFileRequest):
    unique_key: str


class UpsertRealtorFileBulkRequest(BaseModel):
    data: list[UpsertRealtorFileBulkSingleRequest]


class FileCallCreateRequest(BaseModel):
    file_id: int
    mobile: str
    description: str
    status: CallStatus


class FileTextCreateRequest(BaseModel):
    file_id: int
    mobile: str
    text: str


class UpsertFileSourceRequest(BaseModel):
    title: str


class UpsertFileStatusRequest(BaseModel):
    title: str


class UpsertFileLabelRequest(BaseModel):
    title: str
    type: LabelType


class CreateTaskRequest(BaseModel):
    title: str
    description: str | None = None
    assigned_to: int
    status: TaskStatus = TaskStatus.TODO
    due_date: datetime | None = None


class UpdateTaskRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    assigned_to: int | None = None
    status: TaskStatus | None = None
    due_date: datetime | None = None


class CreateTaskReportRequest(BaseModel):
    text: str
    task_id: int


class CreateFileConnectionRequest(BaseModel):
    landlord_file_id: int
    tenant_file_id: int
    description: str | None = None
    initiator: FileConnectionInitiator

    class Config:
        use_enum_values = True


class CreateFileConnectionBulkRequest(BaseModel):
    connections: list[CreateFileConnectionRequest]


class UpdateFileConnectionRequest(BaseModel):
    status: FileConnectionStatus | None = None
    description: str | None = None

    class Config:
        use_enum_values = True


class SendFileToRealtorByCategoryRequest(BaseModel):
    send_type: RealtorSharedFileSendType
    file_id: int
    city_id: int | None = None
    district_id: int | None = None
    region: int | None = None
    text: str


class SendFileToRealtorByIdsRequest(BaseModel):
    send_type: RealtorSharedFileSendType
    file_id: int
    realtor_file_ids: list[int]
    text: str


class PublishFileRequest(BaseModel):
    title: str


class ReportRequest(BaseModel):
    duration: ReportDuration | None = None
    start_date: date | None = None
    end_date: date | None = None


class GetPhonesExcelRequest(BaseModel):
    entity_types: list[PhonesEntityType]
    start_date: date
    end_date: date
