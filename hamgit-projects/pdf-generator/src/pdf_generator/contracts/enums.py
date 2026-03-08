from enum import StrEnum


class PartyType(StrEnum):
    LANDLORD = "LANDLORD"
    TENANT = "TENANT"


class PropertyType(StrEnum):
    APARTMENT_RESIDENTIAL = "APARTMENT_RESIDENTIAL"  # آپارتمان مسکونی
    APARTMENT_COMMERCIAL = "APARTMENT_COMMERCIAL"  # آپارتمان تجاری
    APARTMENT_ADMINISTRATIVE = "APARTMENT_ADMINISTRATIVE"  # آپارتمان اداری
    VILLA_RESIDENTIAL = "VILLA_RESIDENTIAL"  # ویلایی مسکونی
    VILLA_COMMERCIAL = "VILLA_COMMERCIAL"  # ویلایی تجاری
    VILLA_ADMINISTRATIVE = "VILLA_ADMINISTRATIVE"  # ویلایی اداری
    LAND_ADMINISTRATIVE = "LAND_ADMINISTRATIVE"  # زمین اداری
    LAND_COMMERCIAL = "LAND_COMMERCIAL"  # زمین تجاری
    LAND_AGRICULTURAL = "LAND_AGRICULTURAL"  # زمین زراعی
    LAND_GARDEN = "LAND_GARDEN"  # زمین باغ و باغچه
    SHOP = "SHOP"  # مغازه
    BOOTH = "BOOTH"  # غرفه
    WAREHOUSE_COMMERCIAL = "WAREHOUSE_COMMERCIAL"  # انبار تجاری
    HALL_COMMERCIAL = "HALL_COMMERCIAL"  # سالن تجاری
    HALL_INDUSTRIAL = "HALL_INDUSTRIAL"  # سالن صنعتی
    WAREHOUSE_INDUSTRIAL = "WAREHOUSE_INDUSTRIAL"  # انبار صنعتی
    SHED_COMMERCIAL = "SHED_COMMERCIAL"  # سوله تجاری
    SHED_INDUSTRIAL = "SHED_INDUSTRIAL"  # سوله صنعتی
    LIVESTOCK = "LIVESTOCK"  # دامداری
    DAIRY_FARM = "DAIRY_FARM"  # دامپروری
    POULTRY_FARM = "POULTRY_FARM"  # مرغداری
    INDUSTRIAL_WAREHOUSE = "INDUSTRIAL_WAREHOUSE"  # انبار صنعتی
    FISH_FARM = "FISH_FARM"  # پرورش ماهی
    GREENHOUSE = "GREENHOUSE"  # گلخانه
    FACTORY = "FACTORY"  # کارخانه
    WORKSHOP = "WORKSHOP"  # کارگاه
    SPORTS = "SPORTS"  # ورزشی
    HEALTHCARE = "HEALTHCARE"  # بهداشتی
    PUBLIC_SERVICE = "PUBLIC_SERVICE"  # خدمات عمومی
    PARKING = "PARKING"  # پارکینگ
    OTHER = "OTHER"  # سایر


class PropertyDeedStatus(StrEnum):
    BONYAADI = "BONYAADI"  # بنیادی
    SHAHRDAARI = "SHAHRDAARI"  # شهرداری
    ASTAANE_QODS = "ASTAANE_QODS"  # آستان قدس
    SETAADE_EJRAAYI_FARMAAN_EMAAM = "SETAADE_EJRAAYI_FARMAAN_EMAAM"  # ستاد اجرای فرمان امام
    DOLATI = "DOLATI"  # دولتی
    SHAKHSI = "SHAKHSI"  # شخصی
    OQAAFI = "OQAAFI"  # اوقافی
    TA_AVONI = "TA_AVONI"  # تعاونی
    BEDOUNE_SANAD = "BEDOUNE_SANAD"  # بدون سند
    MOQOUFEH_AAM = "MOQOUFEH_AAM"  # موقوف عام
    MOQOUFEH_KHAAS = "MOQOUFEH_KHAAS"  # موقوف خاص
    SHERKATE_SAHAAMIE_KHAAS = "SHERKATE_SAHAAMIE_KHAAS"  # شرکت سهام خاص
    SHERKATE_SAHAAMIE_AAM = "SHERKATE_SAHAAMIE_AAM"  # شرکت سهام عام


class PropertyStructureType(StrEnum):
    BRICK_OR_CINDER_BLOCK = "BRICK_OR_CINDER_BLOCK"  # آجر یا بلوک سیمانی
    WITHOUT_SKELETON = "WITHOUT_SKELETON"  # بدون اسکلت
    CONCRETE = "CONCRETE"  # بتونی
    METAL = "METAL"  # فلزی
    CONCRETE_AND_METAL = "CONCRETE_AND_METAL"  # بتونی و فلزی
    ADOBE_OR_MUD = "ADOBE_OR_MUD"  # خشتی یا گلی
    WOODEN = "WOODEN"  # چوبی


class PropertyFacadeType(StrEnum):
    STONE = "STONE"  # سنگی
    WOOD = "WOOD"  # چوب
    BRICK = "BRICK"  # آجر
    CLAY_AND_MUD = "CLAY_AND_MUD"  # خشت و گل
    CEMENT = "CEMENT"  # سیمان
    COMPOSITE = "COMPOSITE"  # کامپوزیت
    ALUMINUM = "ALUMINUM"  # آلومینیوم
    GLASS = "GLASS"  # شیشه
    STONE_AND_COMPOSITE = "STONE_AND_COMPOSITE"  # سنگ و کامپوزیت
    STONE_AND_CERAMICS = "STONE_AND_CERAMICS"  # سنگ و سرامیک
    CERAMIC = "CERAMIC"  # سرامیک
    TRAVERTINE = "TRAVERTINE"  # تراورتن


class PropertyDirectionType(StrEnum):
    NORTHERN = "NORTHERN"  # شمالی
    SOUTHERN = "SOUTHERN"  # جنوبی
    WESTERN = "WESTERN"  # غربی
    EASTERN = "EASTERN"  # شرقی


class PropertyFlooringType(StrEnum):
    LIMIT = "LIMIT"  # لیمیت
    STONE = "STONE"  # سنگ
    WOOD = "WOOD"  # چوب
    PARQUET = "PARQUET"  # پارکت
    MOSAIC = "MOSAIC"  # موزاییک
    CERAMIC = "CERAMIC"  # سرامیک
    CARPET = "CARPET"  # موکت
    CEMENT = "CEMENT"  # سیمان


class PropertyRestroomType(StrEnum):
    DOES_NOT_HAVE = "DOES_NOT_HAVE"  # ندارد
    IRANI = "IRANI"  # ایرانی
    FARANGI = "FARANGI"  # فرنگی
    BOTH = "BOTH"  # هر دو


class PropertyHeatingSystemType(StrEnum):
    FIREPLACE = "FIREPLACE"  # شومینه
    HEATER = "HEATER"  # بخاری
    TORCH = "TORCH"  # مشعل
    CHILLER = "CHILLER"  # چیلر
    RADIATOR = "RADIATOR"  # شوفاژ
    PACKAGE_UNIT = "PACKAGE_UNIT"  # پکیج
    OTHER = "OTHER"  # سایر


class PropertyCoolingSystemType(StrEnum):
    CHILLER = "CHILLER"  # چیلر
    WATER_COOLER = "WATER_COOLER"  # کولر آبی
    AIR_CONDITIONER = "AIR_CONDITIONER"  # کولر گازی
    OTHER = "OTHER"  # سایر


class PropertyKitchenType(StrEnum):
    DOES_NOT_HAVE = "DOES_NOT_HAVE"  # ندارد
    OPEN = "OPEN"  # اپن
    STANDARD = "STANDARD"  # معمولی
    MDF = "MDF"  # MDF


class PropertySupplyType(StrEnum):
    DOES_NOT_HAVE = "DOES_NOT_HAVE"  # بدون
    PUBLIC = "PUBLIC"  # دارای سیستم عمومی
    PRIVATE = "PRIVATE"  # دارای سیستم خصوصی

class PropertyFacilitiesType(StrEnum):
    GAS_STOVE = "GAS_STOVE"  # گاز رو میزی
    JACUZZI = "JACUZZI"  # جکوزی
    REMOTE_CONTROLLED_DOOR = "REMOTE_CONTROLLED_DOOR"  # درب ریموت دار
    ELECTRIC_SHUTTER = "ELECTRIC_SHUTTER"  # کرکره برقی
    RANGE_HOOD = "RANGE_HOOD"  # هود
    SAUNA = "SAUNA"  # سونا
    WATER_WELL = "WATER_WELL"  # چاه آب
    ANTI_THEFT_DOOR = "ANTI_THEFT_DOOR"  # درب ضد سرقت
    SWIMMING_POOL = "SWIMMING_POOL"  # استخر
    FURNITURE = "FURNITURE"  # مبلمان
    BASEMENT = "BASEMENT"  # زیرزمین
    COMMUNITY_HALL = "COMMUNITY_HALL"  # سالن اجتماعات
    CURTAINS = "CURTAINS"  # پرده
    LOBBY = "LOBBY"  # لابی
    GREEN_SPACE_AND_FOUNTAIN = "GREEN_SPACE_AND_FOUNTAIN"  # فضای سبز و آبنما
    CCTV = "CCTV"  # دوربین مداربسته
    TERRACE = "TERRACE"  # تراس
    KITCHEN_CABINETS = "KITCHEN_CABINETS"  # کابینت
    CARPET_FLOOR = "CARPET_FLOOR"  # کف موکت
    PRIVATE_YARD = "PRIVATE_YARD"  # حیاط خلوت
    SPRING_ROOM = "SPRING_ROOM"  # بهار خواب
    BALCONY = "BALCONY"  # بالکن
    LIGHTING_SYSTEM = "LIGHTING_SYSTEM"  # سیستم روشنایی
    JANITOR_CLOSET = "JANITOR_CLOSET"  # کمد سرایداری
    PATIO = "PATIO"  # پاسیو
    ROOF_WATER_TANK = "ROOF_WATER_TANK"  # تانکر پشت بام
    VIDEO_INTERCOM = "VIDEO_INTERCOM"  # آیفن تصویری
    WATER_HEATER = "WATER_HEATER"  # آب گرم کن
    CHANDELIER = "CHANDELIER"  # لوستر


class PRContractStep(StrEnum):
    DATES_AND_PENALTIES = "DATES_AND_PENALTIES"
    MONTHLY_RENT = "MONTHLY_RENT"
    DEPOSIT = "DEPOSIT"
    DEPOSIT_PAYMENT = "DEPOSIT_PAYMENT"
    RENT_PAYMENT = "RENT_PAYMENT"
    TENANT_INFORMATION = "TENANT_INFORMATION"
    LANDLORD_INFORMATION = "LANDLORD_INFORMATION"
    PROPERTY_SPECIFICATIONS = "PROPERTY_SPECIFICATIONS"
    PROPERTY_DETAILS = "PROPERTY_DETAILS"
    PROPERTY_FACILITIES = "PROPERTY_FACILITIES"
    ADD_COUNTER_PARTY = "ADD_COUNTER_PARTY"
    TENANT_APPROVE = "TENANT_APPROVE"
    LANDLORD_SIGNATURE = "LANDLORD_SIGNATURE"
    TENANT_SIGNATURE = "TENANT_SIGNATURE"
    LANDLORD_COMMISSION = "LANDLORD_COMMISSION"
    TENANT_COMMISSION = "TENANT_COMMISSION"
    ADMIN_APPROVE = "ADMIN_APPROVE"
    ADMIN_REJECT = "ADMIN_REJECT"
    TRACKING_CODE_REQUESTED = "TRACKING_CODE_REQUESTED"
    TRACKING_CODE_DELIVERED = "TRACKING_CODE_DELIVERED"
    TRACKING_CODE_FAILED = "TRACKING_CODE_FAILED"
    LANDLORD_REJECTED = "LANDLORD_REJECTED"
    TENANT_REJECTED = "TENANT_REJECTED"


class PaymentMethod(StrEnum):
    CASH = "CASH"
    CHEQUE = "CHEQUE"


class PaymentType(StrEnum):
    DEPOSIT = "DEPOSIT"
    RENT = "RENT"
    COMMISSION = "COMMISSION"
    PENALTY = "PENALTY"
    OTHER = "OTHER"


class ChequeCategory(StrEnum):
    SALARY = "SALARY"
    INSURANCE = "INSURANCE"
    HEALTH_CARE = "HEALTH_CARE"
    INVESTMENT = "INVESTMENT"
    FOREIGN_EXCHANGE = "FOREIGN_EXCHANGE"
    LOAN = "LOAN"
    RETIREMENT = "RETIREMENT"
    MOVABLE_PROPERTY = "MOVABLE_PROPERTY"
    IMMOVABLE_PROPERTY = "IMMOVABLE_PROPERTY"
    CASH_MANAGEMENT = "CASH_MANAGEMENT"
    CUSTOMS_DUTIES = "CUSTOMS_DUTIES"
    TAX_DUTIES = "TAX_DUTIES"
    GOVERNMENTAL_SERVICES = "GOVERNMENTAL_SERVICES"
    FACILITIES = "FACILITIES"
    BAIL_DEPOSIT = "BAIL_DEPOSIT"
    DAILY_EXPENSES = "DAILY_EXPENSES"
    CHARITY = "CHARITY"
    GOODS_PURCHASE = "GOODS_PURCHASE"
    SERVICES_PURCHASE = "SERVICES_PURCHASE"


class ChequePayeeType(StrEnum):
    INDIVIDUAL = "INDIVIDUAL"  # شخص حقیقی
    LEGAL_ENTITY = "LEGAL_ENTITY"  # شخص حقوقی
    FOREIGN_NATIONALS = "FOREIGN_NATIONALS"  # اتباع خارجی


class ContractStatus(StrEnum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    PENDING_COMMISSION = "PENDING_COMMISSION"
    PENDING_ADMIN_APPROVAL = "PENDING_ADMIN_APPROVAL"
    ADMIN_APPROVED = "ADMIN_APPROVED"
    ADMIN_REJECTED = "ADMIN_REJECTED"
    EDIT_REQUESTED = "EDIT_REQUESTED"
    COMPLETED = "COMPLETED"
    REVOKED = "REVOKED"
    PARTY_REJECTED = "PARTY_REJECTED"
    PDF_GENERATED = "PDF_GENERATED"
    PDF_GENERATING_FAILED = "PDF_GENERATING_FAILED"
