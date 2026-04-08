import { AdPropertyTypeEnums } from '@/data/enums/ad_property_type_enums'
import homeBuyImg from '@/assets/images/requirements/home_buy.svg'
import homeBuyActiveImg from '@/assets/images/requirements/home_buy_active.svg'
import homeRentalImg from '@/assets/images/requirements/home_rental.svg'
import homeRentalActiveImg from '@/assets/images/requirements/home_rental_active.svg'

const adTypePaths = {
  FOR_SALE: 'for_sale',
  FOR_RENT: 'for_rent',
}

const adTypeOptions = [
  {
    value: AdPropertyTypeEnums.FOR_SALE,
    icon: homeBuyImg.src,
    iconActive: homeBuyActiveImg.src,
    path: `/${adTypePaths.FOR_SALE}`,
    label: 'فروش',
  },
  {
    value: AdPropertyTypeEnums.FOR_RENT,
    icon: homeRentalImg.src,
    iconActive: homeRentalActiveImg.src,
    path: `/${adTypePaths.FOR_RENT}`,
    label: 'رهن و اجاره',
  },
]

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
  [propertyAdCategoryEnums.COMMERCIAL]: 'اداری',
  [propertyAdCategoryEnums.INSDUSTRIAL]: 'صنعتی',
  [propertyAdCategoryEnums.IN_CONTRUCTION]: 'درحال ساخت',
  [propertyAdCategoryEnums.ADMINISTRATIVE]: 'تجاری',
}

export { adTypeOptions, adTypePaths, propertyAdCategoryEnums, propertyAdCategoryTranslation }
