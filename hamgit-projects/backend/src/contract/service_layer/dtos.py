import datetime as dt
from dataclasses import dataclass, field
from enum import StrEnum

from pydantic import BaseModel

from account.domain.enums import UserRole
from contract.domain import enums
from core.base.base_dto import BaseDto
from financial.domain.enums import ProvinceType
from shared.domain import enums as shared_enums


@dataclass
class ContractPartyDto(BaseDto):
    user_id: int
    party_type: enums.PartyType


@dataclass
class InquireContractDto(BaseDto):
    key: str
    password: str


@dataclass
class CalculateRentCommissionDto(BaseDto):
    security_deposit_amount: int
    rent_amount: int


@dataclass
class CalculateSaleCommissionDto(BaseDto):
    city: ProvinceType
    sale_price: int


@dataclass
class ContractDto(BaseDto):
    status: enums.ContractStatus
    owner_user_id: int
    owner_party_type: enums.PartyType
    start_date: dt.date | None
    end_date: dt.date | None
    deposit_amount: int | None
    monthly_rent_amount: int | None
    steps: set[enums.PRContractStep]
    parties: dict[enums.PartyType, int]

    @classmethod
    def loads(cls, data: dict) -> "ContractDto":
        return cls(
            status=enums.ContractStatus.resolve(data["status"]),
            owner_user_id=data["owner_user_id"],
            owner_party_type=enums.PartyType.resolve(data["owner_party_type"]),
            start_date=data.get("start_date"),
            end_date=data.get("end_date"),
            deposit_amount=data.get("deposit_amount"),
            monthly_rent_amount=data.get("monthly_rent_amount"),
            parties=data["parties"],
            steps={enums.PRContractStep.resolve(step) for step in data["steps"]} if data["steps"] != [None] else set(),
        )

    def includes_steps(self, steps: set[enums.PRContractStep]) -> bool:
        return steps.issubset(self.steps)

    @property
    def tenant_user_id(self) -> int | None:
        return self.parties.get(enums.PartyType.TENANT)

    @property
    def landlord_user_id(self) -> int | None:
        return self.parties.get(enums.PartyType.LANDLORD)

    @property
    def both_parties_set(self) -> bool:
        return len(self.parties) == 2


@dataclass
class AddPRContractCounterPartyDto(BaseDto):
    mobile: str
    national_code: str


@dataclass
class StartContractDto(BaseDto):
    contract_type: enums.ContractType
    party_type: enums.PartyType
    is_guaranteed: bool = False


@dataclass
class CreateEmptyContractDto(BaseDto):
    tracking_code: str


@dataclass
class AdminStartContractDto(BaseDto):
    contract_type: enums.ContractType
    owner: ContractPartyDto
    is_guaranteed: bool = False


class LandlordDto(BaseModel):
    mobile: str
    national_code: str
    birth_date: dt.date


class TenantDto(BaseModel):
    mobile: str
    national_code: str
    birth_date: dt.date


class RealtorStartContractRequest(BaseModel):
    landlord: LandlordDto
    tenant: TenantDto


@dataclass
class UpsertPRContractTenantDto(BaseDto):
    national_code: str
    birth_date: dt.date
    iban: str
    iban_owner_name: str
    postal_code: str | None = None
    address: str | None = None


@dataclass
class UpsertPRContractLandlordDto(BaseDto):
    rent_iban: str
    rent_iban_owner_name: str
    deposit_iban: str
    deposit_iban_owner_name: str
    national_code: str
    birth_date: dt.date
    postal_code: str | None = None
    address: str | None = None


@dataclass
class UpdatePRContractDatesAndPenaltiesDto(BaseDto):
    contract_date: dt.date
    property_handover_date: dt.date
    start_date: dt.date
    end_date: dt.date
    landlord_penalty_fee: int
    tenant_penalty_fee: int


@dataclass
class UpdatePrContractDepositDto(BaseDto):
    deposit_amount: int


@dataclass
class UpdatePRContractMonthlyRentDto(BaseDto):
    monthly_rent_amount: int


@dataclass
class UpsertPRContractPropertySpecificationsDto(BaseDto):
    property_type: shared_enums.PropertyType
    deed_status: shared_enums.PropertyDeedStatus
    city_id: int
    registration_area: str
    address: str
    family_members_count: int
    deed_image_file_ids: list[int] = field(default_factory=list)
    main_register_number: int | None = None
    sub_register_number: int | None = None
    electricity_bill_id: str | None = None
    postal_code: str | None = None


@dataclass
class UpsertPRContractPropertyDetailsDto(BaseDto):
    area: float
    build_year: int
    structure_type: shared_enums.PropertyStructureType
    direction_type: shared_enums.PropertyDirectionType
    facade_types: list[shared_enums.PropertyFacadeType] = field(default_factory=list)
    flooring_types: list[shared_enums.PropertyFlooringType] = field(default_factory=list)


@dataclass
class UpsertPRContractPropertyFacilitiesDto(BaseModel):
    restroom_type: shared_enums.PropertyRestroomType
    kitchen_type: shared_enums.PropertyKitchenType
    water_supply_type: shared_enums.PropertySupplyType
    electricity_supply_type: shared_enums.PropertySupplyType
    gas_supply_type: shared_enums.PropertySupplyType
    sewage_supply_type: shared_enums.PropertySupplyType
    heating_system_types: list[shared_enums.PropertyHeatingSystemType] = field(default_factory=list)
    cooling_system_types: list[shared_enums.PropertyCoolingSystemType] = field(default_factory=list)

    number_of_rooms: int | None = None

    parking: bool = False
    parking_number: int | None = None

    landline: bool = False
    landline_number: list[str] | None = None

    elevator: bool = False

    storage_room: bool = False
    storage_room_number: int | None = None
    storage_room_area: float | None = None

    other_facilities: list[shared_enums.PropertyFacilitiesType] = field(default_factory=list)
    description: str | None = None


@dataclass
class PRContractPropertyDto(BaseDto):
    property_type: shared_enums.PropertyType | None = None
    deed_status: shared_enums.PropertyDeedStatus | None = None
    city_id: int | None = None
    registration_area: str | None = None
    address: str | None = None
    main_register_number: int | None = None
    sub_register_number: int | None = None
    electricity_bill_id: str | None = None
    postal_code: str | None = None
    area: float | None = None
    build_year: int | None = None
    structure_type: shared_enums.PropertyStructureType | None = None
    direction_type: shared_enums.PropertyDirectionType | None = None
    facade_types: list[shared_enums.PropertyFacadeType] | None = None
    flooring_types: list[shared_enums.PropertyFlooringType] | None = None
    restroom_type: shared_enums.PropertyRestroomType | None = None
    kitchen_type: shared_enums.PropertyKitchenType | None = None
    water_supply_type: shared_enums.PropertySupplyType | None = None
    electricity_supply_type: shared_enums.PropertySupplyType | None = None
    gas_supply_type: shared_enums.PropertySupplyType | None = None
    sewage_supply_type: shared_enums.PropertySupplyType | None = None
    heating_system_types: list[shared_enums.PropertyHeatingSystemType] | None = None
    cooling_system_types: list[shared_enums.PropertyCoolingSystemType] | None = None
    number_of_rooms: int | None = None
    parking: bool | None = None
    parking_number: int | None = None
    landline: bool | None = None
    landline_number: list[str] | None = None
    storage_room: bool | None = None
    storage_room_number: int | None = None
    storage_room_area: float | None = None
    other_facilities: list[shared_enums.PropertyFacilitiesType] = field(default_factory=list)
    description: str | None = None
    elevator: bool | None = None
    is_rebuilt: bool | None = None
    deed_image_file_ids: list[int] | None = None
    family_members_count: int | None = None


@dataclass
class CreateContractClauseDto(BaseDto):
    body: str


@dataclass
class CreateContractDescriptionDto(BaseDto):
    contract_id: int
    text: str


@dataclass
class UpdateContractClauseDto(BaseDto):
    body: str


@dataclass
class VerifyPRContractPartyOtpSignDto(BaseDto):
    otp: str


@dataclass
class UpdateContractStatusDto(BaseDto):
    class UpdateContractStatus(StrEnum):
        ACTIVE = "ACTIVE"
        COMPLETED = "COMPLETED"
        ADMIN_REJECTED = "ADMIN_REJECTED"

    status: UpdateContractStatus


@dataclass
class UpdateContractTrackingCodeDto(BaseDto):
    tracking_code_status: enums.TrackingCodeStatus
    tracking_code: str | None = None


@dataclass
class PrContractCashPaymentDto(BaseDto):
    payment_type: enums.PRContractPaymentType
    due_date: dt.date
    amount: int
    description: str | None = None


@dataclass
class PrContractChequePaymentDto(BaseDto):
    payment_type: enums.PRContractPaymentType
    due_date: dt.date
    amount: int
    serial: str
    series: str
    sayaad_code: str
    category: enums.ChequeCategory
    payee_type: enums.ChequePayeeType
    payee_national_code: str
    image_file_id: int
    description: str | None = None


@dataclass
class PrContractMonthlyRentPaymentDto(BaseDto):
    day_of_month: int = field(default=1)


@dataclass
class FinalizePrContractPaymentDto(BaseDto):
    payment_type: enums.PRContractPaymentType


@dataclass
class PRContractEditRequestDto(BaseDto):
    description: str | None = None


@dataclass
class UpdatePRContractDatesAndAmountsDto(BaseDto):
    date: dt.date | None = None
    property_handover_date: dt.date | None = None
    start_date: dt.date | None = None
    end_date: dt.date | None = None

    deposit_amount: int | None = None
    rent_amount: int | None = None
    tenant_penalty_fee: int | None = None
    landlord_penalty_fee: int | None = None

    tenant_family_members_count: int | None = None


@dataclass
class CreateContractPaymentDto(BaseDto):
    payer: enums.PRCPartyType
    payee: enums.PRCPartyType
    amount: int
    method: enums.PaymentMethod  # cash, cheque
    type: enums.PaymentType  # deposit, rent
    due_date: dt.date  # date when payment should be made
    status: enums.PaymentStatus  # paid, not_paid, overdue, cancelled
    # paid_at: dt.datetime | None
    description: str | None
    cheque_data: dict | None


@dataclass
class UpdateContractPaymentDto(BaseDto):
    amount: int
    method: enums.PaymentMethod  # cash, cheque
    type: enums.PaymentType  # deposit, rent
    due_date: dt.date  # date when payment should be made
    status: enums.PaymentStatus  # paid, not_paid, overdue, cancelled
    # paid_at: dt.datetime | None
    description: str | None
    cheque_data: dict | None


@dataclass
class CreatePRContractDto:
    landlord_user_id: int
    tenant_user_id: int
    #
    date: dt.date
    start_date: dt.date
    end_date: dt.date
    rent_amount: int
    rent_day: int | None
    deposit_amount: int
    property_handover_date: dt.date
    tenant_penalty_fee: int
    landlord_penalty_fee: int
    #
    tenant_iban: str
    tenant_iban_owner_name: str
    #
    landlord_rent_iban: str
    landlord_rent_iban_owner_name: str
    landlord_deposit_iban: str
    landlord_deposit_iban_owner_name: str
    #
    tenant_family_members_count: int | None = None
    is_guaranteed: bool = False


# ---------------------------admin-contract-creation---------------------------


@dataclass
class UserInfo:
    mobile: str
    national_code: str
    verify_identity: bool = False
    address: str | None = None
    last_name: str | None = None
    first_name: str | None = None
    father_name: str | None = None
    postal_code: str | None = None
    birth_date: dt.date | None = None


@dataclass
class PrContractInfo: ...


@dataclass
class ContractPartyInfo:
    contract_id: int
    user_id: int
    party_type: enums.PartyType
    is_primary: bool
    user_role: UserRole
    signature_type: enums.SignatureType | None
    signed_at: dt.datetime | None
    signature_data: dict | None


@dataclass
class PropertyInfo:
    property_type: shared_enums.PropertyType
    deed_status: shared_enums.PropertyDeedStatus
    deed_image_file_ids: list[int]
    city_id: int
    registration_area: str
    main_register_number: int
    sub_register_number: int
    postal_code: str
    address: str
    area: float
    build_year: int
    structure_type: shared_enums.PropertyStructureType
    facade_types: list[shared_enums.PropertyFacadeType]
    direction_type: shared_enums.PropertyDirectionType
    flooring_types: list[shared_enums.PropertyFlooringType]
    is_rebuilt: bool
    restroom_type: shared_enums.PropertyRestroomType
    heating_system_types: list[shared_enums.PropertyHeatingSystemType]
    cooling_system_types: list[shared_enums.PropertyCoolingSystemType]
    kitchen_type: shared_enums.PropertyKitchenType
    water_supply_type: shared_enums.PropertySupplyType
    electricity_supply_type: shared_enums.PropertySupplyType
    gas_supply_type: shared_enums.PropertySupplyType
    sewage_supply_type: shared_enums.PropertySupplyType
    number_of_rooms: int
    parking: bool
    parking_number: int
    landline: bool
    landline_number: list[str]
    storage_room: bool
    storage_room_number: int
    storage_room_area: float
    other_facilities: list[shared_enums.PropertyFacilitiesType]
    description: str


@dataclass
class ContractClauseInfo:
    contract_id: int
    clause_name: str
    clause_number: int
    subclause_number: int
    subclause_name: str | None
    body: str
    is_editable: bool
    is_deletable: bool


@dataclass
class PaymentInfo:
    contract_id: int
    owner_id: int
    payer_id: int
    payee_id: int
    amount: int
    method: enums.PaymentMethod
    type: enums.PaymentType
    due_date: dt.date
    invoice_id: int | None = None
    status: enums.PaymentStatus = enums.PaymentStatus.UNPAID
    paid_at: dt.datetime | None = None
    description: str | None = None
    is_bulk: bool = False


@dataclass
class PaymentChequeInfo:
    payment_id: int
    serial: str
    series: str
    sayaad_code: str
    image_file_id: int
    category: enums.ChequeCategory
    payee_type: enums.ChequePayeeType
    payee_national_code: str
    status: enums.ChequeStatus = enums.ChequeStatus.PENDING


@dataclass
class SendOtpDto(BaseDto):
    mobile: str


@dataclass
class UpdateContractPartyDto(BaseDto):
    first_name: str | None
    last_name: str | None
    father_name: str | None
    national_code: str | None
    address: str | None
    postal_code: str | None
    birth_date: dt.date | None


@dataclass
class UpsertPRContractAccountsDto(BaseDto):
    tenant_iban: str | None = None
    tenant_iban_owner_name: str | None = None
    #
    landlord_rent_iban: str | None = None
    landlord_rent_iban_owner_name: str | None = None
    landlord_deposit_iban: str | None = None
    landlord_deposit_iban_owner_name: str | None = None


@dataclass
class SendContractSignOtpDto(BaseDto):
    party_type: enums.PartyType


@dataclass
class SignContractForPartyDto(BaseDto):
    otp: str | None = None
    sign_date: dt.datetime | None = None
