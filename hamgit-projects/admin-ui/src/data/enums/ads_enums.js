const VisitRequestStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
}

const VisitRequestStatusOptions = [
  {
    value: VisitRequestStatus.ACCEPTED,
    label: 'منتشر شده',
    color: 'green',
  },
  {
    value: VisitRequestStatus.REJECTED,
    label: 'رد شده',
    color: 'red',
  },
  {
    value: VisitRequestStatus.PENDING,
    label: 'در انتظار تایید',
    color: 'yellow',
  },
]

const AdPropertyTypeEnums = {
  FOR_RENT: 'FOR_RENT',
  FOR_SALE: 'FOR_SALE',
}

const AdPropertyTypeTranslation = {
  [AdPropertyTypeEnums.FOR_RENT]: 'رهن و اجاره',
  [AdPropertyTypeEnums.FOR_SALE]: 'خرید و فروش',
}

const propertyAdCategoryEnums = {
  LAND: 'LAND',
  VILLA: 'VILLA',
  OTHERS: 'OTHERS',
  APARTMENT: 'APARTMENT',
  COMMERCIAL: 'COMMERCIAL',
  INSDUSTRIAL: 'INSDUSTRIAL',
  IN_CONTRUCTION: 'IN_CONTRUCTION',
  ADMINISTRATIVE: 'ADMINISTRATIVE',
}
const propertyAdCategoryTranslation = {
  [propertyAdCategoryEnums.LAND]: 'زمین',
  [propertyAdCategoryEnums.VILLA]: 'ویلایی',
  [propertyAdCategoryEnums.OTHERS]: 'سایر',
  [propertyAdCategoryEnums.APARTMENT]: 'آپارتمان',
  [propertyAdCategoryEnums.COMMERCIAL]: 'صنعتی',
  [propertyAdCategoryEnums.INSDUSTRIAL]: 'اداری',
  [propertyAdCategoryEnums.IN_CONTRUCTION]: 'درحال ساخت',
  [propertyAdCategoryEnums.ADMINISTRATIVE]: 'تجاری',
}

const AdStatusEnums = {
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
  ARCHIVED: 'ARCHIVED',
}

const AdStatusEnumsTranslations = {
  [AdStatusEnums.PUBLISHED]: 'منتشر شده',
  [AdStatusEnums.REJECTED]: 'ردشده',
  [AdStatusEnums.PENDING]: 'در صف انتشار',
  [AdStatusEnums.ARCHIVED]: 'بایگانی شده',
}

export {
  VisitRequestStatus,
  VisitRequestStatusOptions,
  AdPropertyTypeEnums,
  AdPropertyTypeTranslation,
  propertyAdCategoryTranslation,
  AdStatusEnums,
  AdStatusEnumsTranslations,
}
