import datetime as dt
from dataclasses import dataclass

from . import enums


@dataclass
class BankAccount:
    id: int
    iban: str
    owner_name: str


@dataclass
class City:
    name: str
    province: str


@dataclass
class Property:
    property_type: enums.PropertyType
    deed_status: enums.PropertyDeedStatus
    address: str
    number_of_rooms: int
    city: City
    postal_code: str | None
    registration_area: str | None  # حوزه ثبتی
    main_register_number: int | None  # پلاک ثبتی اصلی
    sub_register_number: int | None  # پلاک ثبتی فرعی

    # Details
    area: float | None  # مساحت
    build_year: int | None  # سال ساخت
    structure_type: enums.PropertyStructureType | None  # نوع اسکلت ساختمان
    facade_types: list[enums.PropertyFacadeType]  # نوع نمای ساختمان
    direction_type: enums.PropertyDirectionType | None  # سمت واحد
    flooring_types: list[enums.PropertyFlooringType]  # نوع کفپوش ساختمان
    is_rebuilt: bool | None  # آیا ملک بازسازی شده است؟

    # Facilities
    restroom_type: enums.PropertyRestroomType | None  # نوع سرویس بهداشتی
    heating_system_types: list[enums.PropertyHeatingSystemType]  # نوع سیستم گرمایشی
    cooling_system_types: list[enums.PropertyCoolingSystemType]  # نوع سیستم سرمایشی
    kitchen_type: enums.PropertyKitchenType | None  # نوع آشپزخانه

    water_supply_type: enums.PropertySupplyType | None  # آب لوله کشی
    electricity_supply_type: enums.PropertySupplyType | None  # برق شهری
    gas_supply_type: enums.PropertySupplyType | None  # گاز شهری
    sewage_supply_type: enums.PropertySupplyType | None  # سیستم فاضلاب
    number_of_rooms: int | None  # تعداد اتاق

    area: float | None  # مساحت
    build_year: int | None  # سال ساخت

    parking: bool  # پارکینک
    parking_number: int | None  # شماره پارکینک

    landline: bool  # خط تلفن ثابت
    landline_number: list[str] | str | None  # شماره خط تلفن ثابت

    storage_room: bool  # انباری
    storage_room_number: int | None  # شماره انباری
    storage_room_area: float | None  # متراژ انباری

    other_facilities: list[enums.PropertyFacilitiesType]

    elevator: bool | None = None
    electricity_bill_id: str | None = None

    description: str | None = None


@dataclass
class ContractClause:
    clause_name: str
    clause_number: int
    subclause_number: int
    body: str
    subclause_name: str | None = None


@dataclass
class Cheque:
    serial: str
    series: str
    sayaad_code: str
    category: enums.ChequeCategory
    payee_type: enums.ChequePayeeType
    payee_national_code: str


@dataclass
class ContractPayment:
    amount: int
    due_date: dt.date
    is_bulk: bool
    description: str | None
    method: enums.PaymentMethod
    type: enums.PaymentType
    cheque: Cheque | None = None


@dataclass
class Tenant:
    user_id: int
    mobile: str
    first_name: str
    last_name: str
    father_name: str
    national_code: str
    address: str
    signed_at: dt.datetime
    bank_account: BankAccount
    birth_date: str | None = None


@dataclass
class Landlord:
    user_id: int
    mobile: str
    first_name: str
    last_name: str
    father_name: str
    national_code: str
    address: str
    signed_at: dt.datetime
    rent_bank_account: BankAccount
    deposit_bank_account: BankAccount
    birth_date: str | None = None


@dataclass
class PRContract:
    id: int
    owner_type: enums.PartyType
    date: dt.date
    handover_date: dt.date | None
    start_date: dt.date | None
    end_date: dt.date | None
    contract_duration: int
    deposit_amount: int | None
    monthly_rent_amount: int | None
    tenant_penalty_fee: int | None
    landlord_penalty_fee: int | None
    status: enums.ContractStatus
    tenant: Tenant
    landlord: Landlord
    property: Property
    payments: list[ContractPayment]
    clauses: list[ContractClause]
    password: str | int | None = None
    tracking_code: str | int | None = None
    tenant_family_members_count: str | int | None = "--"
