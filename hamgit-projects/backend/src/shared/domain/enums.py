from enum import Enum

from core.base.base_enum import BaseEnum
from shared.service_layer import texts


class FileAccess(BaseEnum):
    PRIVATE = "private"
    PUBLIC = "public"


class FileType(BaseEnum):
    AVATAR = "AVATAR"
    PROPERTY_DEED = "PROPERTY_DEED"
    CHEQUE = "CHEQUE"
    CONTRACT_PDF = "CONTRACT_PDF"
    PROPERTY_IMAGE = "PROPERTY_IMAGE"


class OtpType(BaseEnum):
    AUTHENTICATION = "AUTHENTICATION"
    SIGN_CONTRACT = "SIGN_CONTRACT"


class PropertyType(BaseEnum):
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


class PropertyFacadeType(BaseEnum):
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


class PropertyDeedStatus(BaseEnum):
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


class PropertyStructureType(BaseEnum):
    BRICK_OR_CINDER_BLOCK = "BRICK_OR_CINDER_BLOCK"  # آجر یا بلوک سیمانی
    WITHOUT_SKELETON = "WITHOUT_SKELETON"  # بدون اسکلت
    CONCRETE = "CONCRETE"  # بتونی
    METAL = "METAL"  # فلزی
    CONCRETE_AND_METAL = "CONCRETE_AND_METAL"  # بتونی و فلزی
    ADOBE_OR_MUD = "ADOBE_OR_MUD"  # خشتی یا گلی
    WOODEN = "WOODEN"  # چوبی


class PropertyFlooringType(BaseEnum):
    LIMIT = "LIMIT"  # لیمیت
    STONE = "STONE"  # سنگ
    WOOD = "WOOD"  # چوب
    PARQUET = "PARQUET"  # پارکت
    MOSAIC = "MOSAIC"  # موزاییک
    CERAMIC = "CERAMIC"  # سرامیک
    CARPET = "CARPET"  # موکت
    CEMENT = "CEMENT"  # سیمان


class PropertyDirectionType(BaseEnum):
    NORTHERN = "NORTHERN"  # شمالی
    SOUTHERN = "SOUTHERN"  # جنوبی
    WESTERN = "WESTERN"  # غربی
    EASTERN = "EASTERN"  # شرقی


class PropertyRestroomType(BaseEnum):
    DOES_NOT_HAVE = "DOES_NOT_HAVE"  # ندارد
    IRANI = "IRANI"  # ایرانی
    FARANGI = "FARANGI"  # فرنگی
    BOTH = "BOTH"  # هر دو


class PropertyFacilitiesType(BaseEnum):
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


class PropertySupplyType(BaseEnum):
    DOES_NOT_HAVE = "DOES_NOT_HAVE"  # بدون
    PUBLIC = "PUBLIC"  # دارای سیستم عمومی
    PRIVATE = "PRIVATE"  # دارای سیستم خصوصی


class PropertyCoolingSystemType(BaseEnum):
    CHILLER = "CHILLER"  # چیلر
    WATER_COOLER = "WATER_COOLER"  # کولر آبی
    AIR_CONDITIONER = "AIR_CONDITIONER"  # کولر گازی
    OTHER = "OTHER"  # سایر


class PropertyHeatingSystemType(BaseEnum):
    FIREPLACE = "FIREPLACE"  # شومینه
    HEATER = "HEATER"  # بخاری
    TORCH = "TORCH"  # مشعل
    CHILLER = "CHILLER"  # چیلر
    RADIATOR = "RADIATOR"  # شوفاژ
    PACKAGE_UNIT = "PACKAGE_UNIT"  # پکیج
    OTHER = "OTHER"  # سایر


class PropertyKitchenType(BaseEnum):
    DOES_NOT_HAVE = "DOES_NOT_HAVE"  # ندارد
    OPEN = "OPEN"  # اپن
    STANDARD = "STANDARD"  # معمولی
    MDF = "MDF"  # MDF


class PropertyCharacteristicType(BaseEnum):
    DUPLEX = "DUPLEX"  # دوبلکس
    PENTHOUSE = "PENTHOUSE"  # پنت هاوس
    LUXURY = "LUXURY"  # لاکچری
    FULL_AMENITIES = "FULL_AMENITIES"  # فول امکانات
    SEPARATE_SITTING = "SEPARATE_SITTING"  # نشیمن مجزا
    GARDEN_TOWER = "GARDEN_TOWER"  # برج باغ
    LEVEL_DIFFERENCE = "LEVEL_DIFFERENCE"  # اختلاف سطح
    RENOVATED = "RENOVATED"  # بازسازی شده
    ENTIRE_FLOOR = "ENTIRE_FLOOR"  # دربست
    SEPARATE_ACCESS = "SEPARATE_ACCESS"  # راه جدا
    SHARED_ACCESS = "SHARED_ACCESS"  # راه مشترک
    RAW = "RAW"  # خام


class PropertyParkingType(BaseEnum):
    COMMON = "COMMON"  # پارکینگ مشاع
    EXCLUSIVE = "EXCLUSIVE"  # پارکینگ اختصاصی
    BLOCKING = "BLOCKING"  # پارکینگ مزاحم
    COVERED = "COVERED"  # مسقف
    UNCOVERED = "UNCOVERED"  # غیر مسقف
    BOX = "BOX"  # باکس


class OccupancyStatus(BaseEnum):
    NOT_OCCUPIED = "NOT_OCCUPIED"
    OWNER_OCCUPIED = "OWNER_OCCUPIED"
    TENANT_OCCUPIED = "TENANT_OCCUPIED"


class SMSTemplates(Enum):
    OTP_TEMPLATE = ("OTP", texts.OTP)
    CUSTOM_PAYMENT_TEMPLATE = ("CustomPayment", texts.CustomPayment)
    SIGN_CONTRACT_OTP_TEMPLATE = ("SignContractOTP", texts.SignContractOTP)
    INVITATION_TO_LANDLORD_TEMPLATE = ("OwnerMustSign", texts.OwnerMustSign)
    INVITATION_TO_TENANT_TEMPLATE = ("RenterMustSign", texts.RenterMustSign)
    COUNTER_PARTY_SIGNED_TEMPLATE = ("SecondSideSigned", texts.SecondSideSigned)
    COUNTER_PARTY_REJECTED_TEMPLATE = ("SecondSideRejected", texts.SecondSideRejected)
    EDIT_REQUESTED_TEMPLATE = ("RevisionRequest", texts.RevisionRequest)
    WALLET_CHARGE_TEMPLATE = ("WalletCharge", texts.WalletCharge)
    INVOICE_LINK_TEMPLATE = ("InvoiceLink", texts.InvoiceLink)
    PAYMENT_BEFORE_ALERT_TEMPLATE = ("PaymentBeforeAlert", texts.PaymentBeforeAlert)
    PAYMENT_AFTER_ALERT_TEMPLATE = ("PaymentAfterAlert", texts.PaymentAfterAlert)
    BOTH_COMMISSIONS_PAID_TEMPLATE = ("BothCommissionsPaid", texts.BothCommissionsPaid)
    LANDLORD_COMMISSION_PAID_TEMPLATE = ("LandlordCommissionPaid", texts.LandlordCommissionPaid)
    TENANT_COMMISSION_PAID_TEMPLATE = ("TenantCommissionPaid", texts.TenantCommissionPaid)
    PAYMENT_BEFORE_ALERT_REGULAR_CONTRACT_TEMPLATE = (
        "PaymentBeforeAlertRegularContract",
        texts.PaymentBeforeAlertRegularContract,
    )
    WELLCOME_MESSAGE = ("WelcomeMessage", texts.WelcomeMessage)
    CONTRACT_REMINDER = ("ContractReminder", texts.ContractReminder)

    def __init__(self, key: str, text: str):
        self.key = key
        self.text = text


class EitaaTemplates(Enum):
    EITAA_YAR_INFORMING_TITLE = ("EitaaYarInformingTitle", texts.EitaaYarInformingTitle)
    EITAA_YAR_INFORMING_TEXT = ("EitaaYarInformingText", texts.EitaaYarInformingText)

    def __init__(self, key: str, text: str):
        self.key = key
        self.text = text


class PartyType(Enum):
    LANDLORD = ("Landlord", texts.Landlord)
    TENANT = ("Tenant", texts.Tenant)

    def __init__(self, key: str, text: str):
        self.key = key
        self.text = text