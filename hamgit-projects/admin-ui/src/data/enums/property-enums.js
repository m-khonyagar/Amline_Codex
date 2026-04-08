// PropertyType Enum
const PropertyType = {
  APARTMENT_RESIDENTIAL: 'APARTMENT_RESIDENTIAL',
  APARTMENT_COMMERCIAL: 'APARTMENT_COMMERCIAL',
  APARTMENT_ADMINISTRATIVE: 'APARTMENT_ADMINISTRATIVE',
  VILLA_RESIDENTIAL: 'VILLA_RESIDENTIAL',
  VILLA_COMMERCIAL: 'VILLA_COMMERCIAL',
  VILLA_ADMINISTRATIVE: 'VILLA_ADMINISTRATIVE',
  LAND_ADMINISTRATIVE: 'LAND_ADMINISTRATIVE',
  LAND_COMMERCIAL: 'LAND_COMMERCIAL',
  LAND_AGRICULTURAL: 'LAND_AGRICULTURAL',
  LAND_GARDEN: 'LAND_GARDEN',
  SHOP: 'SHOP',
  BOOTH: 'BOOTH',
  WAREHOUSE_COMMERCIAL: 'WAREHOUSE_COMMERCIAL',
  HALL_COMMERCIAL: 'HALL_COMMERCIAL',
  HALL_INDUSTRIAL: 'HALL_INDUSTRIAL',
  WAREHOUSE_INDUSTRIAL: 'WAREHOUSE_INDUSTRIAL',
  SHED_COMMERCIAL: 'SHED_COMMERCIAL',
  SHED_INDUSTRIAL: 'SHED_INDUSTRIAL',
  LIVESTOCK: 'LIVESTOCK',
  DAIRY_FARM: 'DAIRY_FARM',
  POULTRY_FARM: 'POULTRY_FARM',
  INDUSTRIAL_WAREHOUSE: 'INDUSTRIAL_WAREHOUSE',
  FISH_FARM: 'FISH_FARM',
  GREENHOUSE: 'GREENHOUSE',
  FACTORY: 'FACTORY',
  WORKSHOP: 'WORKSHOP',
  SPORTS: 'SPORTS',
  HEALTHCARE: 'HEALTHCARE',
  PUBLIC_SERVICE: 'PUBLIC_SERVICE',
  PARKING: 'PARKING',
  OTHER: 'OTHER',
}

const PropertyTypeOptions = [
  { value: PropertyType.APARTMENT_RESIDENTIAL, label: 'آپارتمان مسکونی' },
  { value: PropertyType.APARTMENT_COMMERCIAL, label: 'آپارتمان تجاری' },
  { value: PropertyType.APARTMENT_ADMINISTRATIVE, label: 'آپارتمان اداری' },
  { value: PropertyType.VILLA_RESIDENTIAL, label: 'ویلایی مسکونی' },
  { value: PropertyType.VILLA_COMMERCIAL, label: 'ویلایی تجاری' },
  { value: PropertyType.VILLA_ADMINISTRATIVE, label: 'ویلایی اداری' },
  { value: PropertyType.LAND_ADMINISTRATIVE, label: 'زمین اداری' },
  { value: PropertyType.LAND_COMMERCIAL, label: 'زمین تجاری' },
  { value: PropertyType.LAND_AGRICULTURAL, label: 'زمین زراعی' },
  { value: PropertyType.LAND_GARDEN, label: 'زمین باغ و باغچه' },
  { value: PropertyType.SHOP, label: 'مغازه' },
  { value: PropertyType.BOOTH, label: 'غرفه' },
  { value: PropertyType.WAREHOUSE_COMMERCIAL, label: 'انبار تجاری' },
  { value: PropertyType.HALL_COMMERCIAL, label: 'سالن تجاری' },
  { value: PropertyType.HALL_INDUSTRIAL, label: 'سالن صنعتی' },
  { value: PropertyType.WAREHOUSE_INDUSTRIAL, label: 'انبار صنعتی' },
  { value: PropertyType.SHED_COMMERCIAL, label: 'سوله تجاری' },
  { value: PropertyType.SHED_INDUSTRIAL, label: 'سوله صنعتی' },
  { value: PropertyType.LIVESTOCK, label: 'دامداری' },
  { value: PropertyType.DAIRY_FARM, label: 'دامپروری' },
  { value: PropertyType.POULTRY_FARM, label: 'مرغداری' },
  { value: PropertyType.INDUSTRIAL_WAREHOUSE, label: 'انبار صنعتی' },
  { value: PropertyType.FISH_FARM, label: 'پرورش ماهی' },
  { value: PropertyType.GREENHOUSE, label: 'گلخانه' },
  { value: PropertyType.FACTORY, label: 'کارخانه' },
  { value: PropertyType.WORKSHOP, label: 'کارگاه' },
  { value: PropertyType.SPORTS, label: 'ورزشی' },
  { value: PropertyType.HEALTHCARE, label: 'بهداشتی' },
  { value: PropertyType.PUBLIC_SERVICE, label: 'خدمات عمومی' },
  { value: PropertyType.PARKING, label: 'پارکینگ' },
  { value: PropertyType.OTHER, label: 'سایر' },
]

// PropertyFacadeType Enum
const PropertyFacadeType = {
  STONE: 'STONE',
  WOOD: 'WOOD',
  BRICK: 'BRICK',
  CLAY_AND_MUD: 'CLAY_AND_MUD',
  CEMENT: 'CEMENT',
  COMPOSITE: 'COMPOSITE',
  ALUMINUM: 'ALUMINUM',
  GLASS: 'GLASS',
  STONE_AND_COMPOSITE: 'STONE_AND_COMPOSITE',
  STONE_AND_CERAMICS: 'STONE_AND_CERAMICS',
  CERAMIC: 'CERAMIC',
  TRAVERTINE: 'TRAVERTINE',
}

const PropertyFacadeTypeOptions = [
  { value: PropertyFacadeType.STONE, label: 'سنگی' },
  { value: PropertyFacadeType.WOOD, label: 'چوب' },
  { value: PropertyFacadeType.BRICK, label: 'آجر' },
  { value: PropertyFacadeType.CLAY_AND_MUD, label: 'خشت و گل' },
  { value: PropertyFacadeType.CEMENT, label: 'سیمان' },
  { value: PropertyFacadeType.COMPOSITE, label: 'کامپوزیت' },
  { value: PropertyFacadeType.ALUMINUM, label: 'آلومینیوم' },
  { value: PropertyFacadeType.GLASS, label: 'شیشه' },
  { value: PropertyFacadeType.STONE_AND_COMPOSITE, label: 'سنگ و کامپوزیت' },
  { value: PropertyFacadeType.STONE_AND_CERAMICS, label: 'سنگ و سرامیک' },
  { value: PropertyFacadeType.CERAMIC, label: 'سرامیک' },
  { value: PropertyFacadeType.TRAVERTINE, label: 'تراورتن' },
]

// PropertyDeedStatus Enum
const PropertyDeedStatus = {
  BONYAADI: 'BONYAADI',
  SHAHRDAARI: 'SHAHRDAARI',
  ASTAANE_QODS: 'ASTAANE_QODS',
  SETAADE_EJRAAYI_FARMAAN_EMAAM: 'SETAADE_EJRAAYI_FARMAAN_EMAAM',
  DOLATI: 'DOLATI',
  SHAKHSI: 'SHAKHSI',
  OQAAFI: 'OQAAFI',
  TA_AVONI: 'TA_AVONI',
  BEDOUNE_SANAD: 'BEDOUNE_SANAD',
  MOQOUFEH_AAM: 'MOQOUFEH_AAM',
  MOQOUFEH_KHAAS: 'MOQOUFEH_KHAAS',
  SHERKATE_SAHAAMIE_KHAAS: 'SHERKATE_SAHAAMIE_KHAAS',
  SHERKATE_SAHAAMIE_AAM: 'SHERKATE_SAHAAMIE_AAM',
}

const PropertyDeedStatusOptions = [
  { value: PropertyDeedStatus.BONYAADI, label: 'بنیادی' },
  { value: PropertyDeedStatus.SHAHRDAARI, label: 'شهرداری' },
  { value: PropertyDeedStatus.ASTAANE_QODS, label: 'آستان قدس' },
  { value: PropertyDeedStatus.SETAADE_EJRAAYI_FARMAAN_EMAAM, label: 'ستاد اجرای فرمان امام' },
  { value: PropertyDeedStatus.DOLATI, label: 'دولتی' },
  { value: PropertyDeedStatus.SHAKHSI, label: 'شخصی' },
  { value: PropertyDeedStatus.OQAAFI, label: 'اوقافی' },
  { value: PropertyDeedStatus.TA_AVONI, label: 'تعاونی' },
  { value: PropertyDeedStatus.BEDOUNE_SANAD, label: 'بدون سند' },
  { value: PropertyDeedStatus.MOQOUFEH_AAM, label: 'موقوف عام' },
  { value: PropertyDeedStatus.MOQOUFEH_KHAAS, label: 'موقوف خاص' },
  { value: PropertyDeedStatus.SHERKATE_SAHAAMIE_KHAAS, label: 'شرکت سهام خاص' },
  { value: PropertyDeedStatus.SHERKATE_SAHAAMIE_AAM, label: 'شرکت سهام عام' },
]
// PropertyStructureType Enum
const PropertyStructureType = {
  BRICK_OR_CINDER_BLOCK: 'BRICK_OR_CINDER_BLOCK',
  WITHOUT_SKELETON: 'WITHOUT_SKELETON',
  CONCRETE: 'CONCRETE',
  METAL: 'METAL',
  CONCRETE_AND_METAL: 'CONCRETE_AND_METAL',
  ADOBE_OR_MUD: 'ADOBE_OR_MUD',
  WOODEN: 'WOODEN',
}

const PropertyStructureTypeOptions = [
  { value: PropertyStructureType.BRICK_OR_CINDER_BLOCK, label: 'آجر یا بلوک سیمانی' },
  { value: PropertyStructureType.WITHOUT_SKELETON, label: 'بدون اسکلت' },
  { value: PropertyStructureType.CONCRETE, label: 'بتونی' },
  { value: PropertyStructureType.METAL, label: 'فلزی' },
  { value: PropertyStructureType.CONCRETE_AND_METAL, label: 'بتونی و فلزی' },
  { value: PropertyStructureType.ADOBE_OR_MUD, label: 'خشتی یا گلی' },
  { value: PropertyStructureType.WOODEN, label: 'چوبی' },
]
// PropertyFlooringType Enum
const PropertyFlooringType = {
  LIMIT: 'LIMIT',
  STONE: 'STONE',
  WOOD: 'WOOD',
  PARQUET: 'PARQUET',
  MOSAIC: 'MOSAIC',
  CERAMIC: 'CERAMIC',
  CARPET: 'CARPET',
  CEMENT: 'CEMENT',
}

const PropertyFlooringTypeOptions = [
  { value: PropertyFlooringType.LIMIT, label: 'لیمیت' },
  { value: PropertyFlooringType.STONE, label: 'سنگ' },
  { value: PropertyFlooringType.WOOD, label: 'چوب' },
  { value: PropertyFlooringType.PARQUET, label: 'پارکت' },
  { value: PropertyFlooringType.MOSAIC, label: 'موزاییک' },
  { value: PropertyFlooringType.CERAMIC, label: 'سرامیک' },
  { value: PropertyFlooringType.CARPET, label: 'موکت' },
  { value: PropertyFlooringType.CEMENT, label: 'سیمان' },
]
// PropertyDirectionType Enum
const PropertyDirectionType = {
  NORTHERN: 'NORTHERN',
  SOUTHERN: 'SOUTHERN',
  WESTERN: 'WESTERN',
  EASTERN: 'EASTERN',
}

const PropertyDirectionTypeOptions = [
  { value: PropertyDirectionType.NORTHERN, label: 'شمالی' },
  { value: PropertyDirectionType.SOUTHERN, label: 'جنوبی' },
  { value: PropertyDirectionType.WESTERN, label: 'غربی' },
  { value: PropertyDirectionType.EASTERN, label: 'شرقی' },
]
// PropertyRestroomType Enum
const PropertyRestroomType = {
  DOES_NOT_HAVE: 'DOES_NOT_HAVE',
  IRANI: 'IRANI',
  FARANGI: 'FARANGI',
  BOTH: 'BOTH',
}

const PropertyRestroomTypeOptions = [
  { value: PropertyRestroomType.DOES_NOT_HAVE, label: 'ندارد' },
  { value: PropertyRestroomType.IRANI, label: 'ایرانی' },
  { value: PropertyRestroomType.FARANGI, label: 'فرنگی' },
  { value: PropertyRestroomType.BOTH, label: 'هر دو' },
]
// PropertyFacilitiesType Enum
const PropertyFacilitiesType = {
  GAS_STOVE: 'GAS_STOVE',
  JACUZZI: 'JACUZZI',
  REMOTE_CONTROLLED_DOOR: 'REMOTE_CONTROLLED_DOOR',
  ELECTRIC_SHUTTER: 'ELECTRIC_SHUTTER',
  RANGE_HOOD: 'RANGE_HOOD',
  SAUNA: 'SAUNA',
  WATER_WELL: 'WATER_WELL',
  ANTI_THEFT_DOOR: 'ANTI_THEFT_DOOR',
  SWIMMING_POOL: 'SWIMMING_POOL',
  FURNITURE: 'FURNITURE',
  BASEMENT: 'BASEMENT',
  COMMUNITY_HALL: 'COMMUNITY_HALL',
  CURTAINS: 'CURTAINS',
  LOBBY: 'LOBBY',
  GREEN_SPACE_AND_FOUNTAIN: 'GREEN_SPACE_AND_FOUNTAIN',
  CCTV: 'CCTV',
  TERRACE: 'TERRACE',
  KITCHEN_CABINETS: 'KITCHEN_CABINETS',
  CARPET_FLOOR: 'CARPET_FLOOR',
  PRIVATE_YARD: 'PRIVATE_YARD',
  SPRING_ROOM: 'SPRING_ROOM',
  BALCONY: 'BALCONY',
  LIGHTING_SYSTEM: 'LIGHTING_SYSTEM',
  JANITOR_CLOSET: 'JANITOR_CLOSET',
  PATIO: 'PATIO',
  ROOF_WATER_TANK: 'ROOF_WATER_TANK',
  VIDEO_INTERCOM: 'VIDEO_INTERCOM',
  WATER_HEATER: 'WATER_HEATER',
  CHANDELIER: 'CHANDELIER',
}

const PropertyFacilitiesTypeOptions = [
  { value: PropertyFacilitiesType.GAS_STOVE, label: 'گاز رو میزی' },
  { value: PropertyFacilitiesType.JACUZZI, label: 'جکوزی' },
  { value: PropertyFacilitiesType.REMOTE_CONTROLLED_DOOR, label: 'درب ریموت دار' },
  { value: PropertyFacilitiesType.ELECTRIC_SHUTTER, label: 'کرکره برقی' },
  { value: PropertyFacilitiesType.RANGE_HOOD, label: 'هود' },
  { value: PropertyFacilitiesType.SAUNA, label: 'سونا' },
  { value: PropertyFacilitiesType.WATER_WELL, label: 'چاه آب' },
  { value: PropertyFacilitiesType.ANTI_THEFT_DOOR, label: 'درب ضد سرقت' },
  { value: PropertyFacilitiesType.SWIMMING_POOL, label: 'استخر' },
  { value: PropertyFacilitiesType.FURNITURE, label: 'مبلمان' },
  { value: PropertyFacilitiesType.BASEMENT, label: 'زیرزمین' },
  { value: PropertyFacilitiesType.COMMUNITY_HALL, label: 'سالن اجتماعات' },
  { value: PropertyFacilitiesType.CURTAINS, label: 'پرده' },
  { value: PropertyFacilitiesType.LOBBY, label: 'لابی' },
  { value: PropertyFacilitiesType.GREEN_SPACE_AND_FOUNTAIN, label: 'فضای سبز و آبنما' },
  { value: PropertyFacilitiesType.CCTV, label: 'دوربین مداربسته' },
  { value: PropertyFacilitiesType.TERRACE, label: 'تراس' },
  { value: PropertyFacilitiesType.KITCHEN_CABINETS, label: 'کابینت' },
  { value: PropertyFacilitiesType.CARPET_FLOOR, label: 'کف موکت' },
  { value: PropertyFacilitiesType.PRIVATE_YARD, label: 'حیاط خلوت' },
  { value: PropertyFacilitiesType.SPRING_ROOM, label: 'بهار خواب' },
  { value: PropertyFacilitiesType.BALCONY, label: 'بالکن' },
  { value: PropertyFacilitiesType.LIGHTING_SYSTEM, label: 'سیستم روشنایی' },
  { value: PropertyFacilitiesType.JANITOR_CLOSET, label: 'کمد سرایداری' },
  { value: PropertyFacilitiesType.PATIO, label: 'پاسیو' },
  { value: PropertyFacilitiesType.ROOF_WATER_TANK, label: 'تانکر پشت بام' },
  { value: PropertyFacilitiesType.VIDEO_INTERCOM, label: 'آیفن تصویری' },
  { value: PropertyFacilitiesType.WATER_HEATER, label: 'آب گرم کن' },
  { value: PropertyFacilitiesType.CHANDELIER, label: 'لوستر' },
]
// PropertySupplyType Enum
const PropertySupplyType = {
  DOES_NOT_HAVE: 'DOES_NOT_HAVE',
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
}

const PropertySupplyTypeOptions = [
  { value: PropertySupplyType.DOES_NOT_HAVE, label: 'ندارد' },
  { value: PropertySupplyType.PUBLIC, label: 'دارای سیستم عمومی' },
  { value: PropertySupplyType.PRIVATE, label: 'دارای سیستم خصوصی' },
]
// PropertyCoolingSystemType Enum
const PropertyCoolingSystemType = {
  CHILLER: 'CHILLER',
  WATER_COOLER: 'WATER_COOLER',
  AIR_CONDITIONER: 'AIR_CONDITIONER',
  OTHER: 'OTHER',
}

const PropertyCoolingSystemTypeOptions = [
  { value: PropertyCoolingSystemType.CHILLER, label: 'چیلر' },
  { value: PropertyCoolingSystemType.WATER_COOLER, label: 'کولر آبی' },
  { value: PropertyCoolingSystemType.AIR_CONDITIONER, label: 'کولر گازی' },
  { value: PropertyCoolingSystemType.OTHER, label: 'سایر' },
]
// PropertyHeatingSystemType Enum
const PropertyHeatingSystemType = {
  FIREPLACE: 'FIREPLACE',
  HEATER: 'HEATER',
  TORCH: 'TORCH',
  CHILLER: 'CHILLER',
  RADIATOR: 'RADIATOR',
  PACKAGE_UNIT: 'PACKAGE_UNIT',
  OTHER: 'OTHER',
}

const PropertyHeatingSystemTypeOptions = [
  { value: PropertyHeatingSystemType.FIREPLACE, label: 'شومینه' },
  { value: PropertyHeatingSystemType.HEATER, label: 'بخاری' },
  { value: PropertyHeatingSystemType.TORCH, label: 'مشعل' },
  { value: PropertyHeatingSystemType.CHILLER, label: 'چیلر' },
  { value: PropertyHeatingSystemType.RADIATOR, label: 'شوفاژ' },
  { value: PropertyHeatingSystemType.PACKAGE_UNIT, label: 'پکیج' },
  { value: PropertyHeatingSystemType.OTHER, label: 'سایر' },
]
// PropertyKitchenType Enum
const PropertyKitchenType = {
  DOES_NOT_HAVE: 'DOES_NOT_HAVE',
  OPEN: 'OPEN',
  STANDARD: 'STANDARD',
  MDF: 'MDF',
}

const PropertyKitchenTypeOptions = [
  { value: PropertyKitchenType.DOES_NOT_HAVE, label: 'ندارد' },
  { value: PropertyKitchenType.OPEN, label: 'اپن' },
  { value: PropertyKitchenType.STANDARD, label: 'معمولی' },
  { value: PropertyKitchenType.MDF, label: 'MDF' },
]

const PropertyCharacteristicType = {
  DUPLEX: 'DUPLEX',
  PENTHOUSE: 'PENTHOUSE',
  LUXURY: 'LUXURY',
  FULL_AMENITIES: 'FULL_AMENITIES',
  SEPARATE_SITTING: 'SEPARATE_SITTING',
  GARDEN_TOWER: 'GARDEN_TOWER',
  LEVEL_DIFFERENCE: 'LEVEL_DIFFERENCE',
  RENOVATED: 'RENOVATED',
  ENTIRE_FLOOR: 'ENTIRE_FLOOR',
  SEPARATE_ACCESS: 'SEPARATE_ACCESS',
  SHARED_ACCESS: 'SHARED_ACCESS',
  RAW: 'RAW',
}

const PropertyCharacteristicsTypeOptions = [
  { value: PropertyCharacteristicType.DUPLEX, label: 'دوبلکس' },
  { value: PropertyCharacteristicType.PENTHOUSE, label: 'پنت هاوس' },
  { value: PropertyCharacteristicType.LUXURY, label: 'لاکچری' },
  { value: PropertyCharacteristicType.FULL_AMENITIES, label: 'فول امکانات' },
  { value: PropertyCharacteristicType.SEPARATE_SITTING, label: 'نشیمن مجزا' },
  { value: PropertyCharacteristicType.GARDEN_TOWER, label: 'برج باغ' },
  { value: PropertyCharacteristicType.LEVEL_DIFFERENCE, label: 'اختلاف سطح' },
  { value: PropertyCharacteristicType.RENOVATED, label: 'بازسازی شده' },
  { value: PropertyCharacteristicType.ENTIRE_FLOOR, label: 'دربست' },
  { value: PropertyCharacteristicType.SEPARATE_ACCESS, label: 'راه جدا' },
  { value: PropertyCharacteristicType.SHARED_ACCESS, label: 'راه مشترک' },
  { value: PropertyCharacteristicType.RAW, label: 'خام' },
]

const PropertyOccupancyStatus = {
  NOT_OCCUPIED: 'NOT_OCCUPIED',
  OWNER_OCCUPIED: 'OWNER_OCCUPIED',
  TENANT_OCCUPIED: 'TENANT_OCCUPIED',
}

const PropertyOccupancyStatusOptions = [
  { value: PropertyOccupancyStatus.NOT_OCCUPIED, label: 'خالی' },
  { value: PropertyOccupancyStatus.OWNER_OCCUPIED, label: 'مالک ساکن' },
  { value: PropertyOccupancyStatus.TENANT_OCCUPIED, label: 'مستاجر ساکن' },
]

const PropertyParkingType = {
  COMMON: 'COMMON',
  EXCLUSIVE: 'EXCLUSIVE',
  BLOCKING: 'BLOCKING',
  COVERED: 'COVERED',
  UNCOVERED: 'UNCOVERED',
  BOX: 'BOX',
}

const PropertyParkingTypeOptions = [
  { value: PropertyParkingType.COMMON, label: 'پارکینگ مشاع' },
  { value: PropertyParkingType.EXCLUSIVE, label: 'پارکینگ اختصاصی' },
  { value: PropertyParkingType.BLOCKING, label: 'پارکینگ مزاحم' },
  { value: PropertyParkingType.COVERED, label: 'مسقف' },
  { value: PropertyParkingType.UNCOVERED, label: 'غیر مسقف' },
  { value: PropertyParkingType.BOX, label: 'باکس' },
]

// PropertyRoomCount Enum
const PropertyRoomCount = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
}

const PropertyRoomCountOptions = [
  { value: PropertyRoomCount[0], label: 'بدون اتاق' },
  { value: PropertyRoomCount[1], label: '1' },
  { value: PropertyRoomCount[2], label: '2' },
  { value: PropertyRoomCount[3], label: '3' },
  { value: PropertyRoomCount[4], label: '4' },
]

export {
  PropertyCoolingSystemType,
  PropertyCoolingSystemTypeOptions,
  PropertyDeedStatus,
  PropertyDeedStatusOptions,
  PropertyDirectionType,
  PropertyDirectionTypeOptions,
  PropertyFacadeType,
  PropertyFacadeTypeOptions,
  PropertyFacilitiesType,
  PropertyFacilitiesTypeOptions,
  PropertyFlooringType,
  PropertyFlooringTypeOptions,
  PropertyHeatingSystemType,
  PropertyHeatingSystemTypeOptions,
  PropertyKitchenType,
  PropertyKitchenTypeOptions,
  PropertyCharacteristicType,
  PropertyCharacteristicsTypeOptions,
  PropertyOccupancyStatus,
  PropertyOccupancyStatusOptions,
  PropertyParkingType,
  PropertyParkingTypeOptions,
  PropertyRestroomType,
  PropertyRestroomTypeOptions,
  PropertyStructureType,
  PropertyStructureTypeOptions,
  PropertySupplyType,
  PropertySupplyTypeOptions,
  PropertyType,
  PropertyTypeOptions,
  PropertyRoomCount,
  PropertyRoomCountOptions,
}
