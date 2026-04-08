import { format } from 'date-fns-jalali'
import { useGetHistoryFiles } from '../../api/get-history-files'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { FileStatusLabels, MonopolyLabels } from '@/data/enums/market_enums'
import { userGenderTranslation } from '@/data/enums/user-enums'
import { paymentMethodLabels } from '@/data/enums/prcontract-enums'
import { numberSeparator } from '@/utils/number'
import { translateEnum } from '@/utils/enum'
import {
  PropertyCharacteristicsTypeOptions,
  PropertyCoolingSystemTypeOptions,
  PropertyFacilitiesTypeOptions,
  PropertyFlooringTypeOptions,
  PropertyHeatingSystemTypeOptions,
  PropertyKitchenTypeOptions,
  PropertyOccupancyStatusOptions,
  PropertyParkingTypeOptions,
  PropertyRestroomTypeOptions,
  PropertyTypeOptions,
} from '@/data/enums/property-enums'

// TODO: I should fix this warning
export const labels = {
  file_status: 'وضعیت فایل',
  assigned_to: 'مسئول فایل',
  file_source_id: 'منبع فایل',
  description: 'توضیح وضعیت فایل',
  mobile: 'شماره موبایل',
  second_mobile: 'شماره موبایل دوم',
  full_name: 'نام و نام خانوادگی',
  gender: 'جنسیت',
  rent: 'مبلغ اجاره',
  deposit: 'مبلغ رهن',
  dynamic_amount: 'قابل تبدیل',
  budget: 'بودجه خرید',
  sale_price: 'قیمت ملک',
  sale_payment_method: 'شرایط پرداخت',
  city_id: 'شهر',
  district_id: 'محله',
  district_ids: 'محله',
  region: 'منطقه',
  regions: 'مناطق',
  address: 'جزئیات آدرس',
  address_description: 'توضیحات آدرس',
  latitude: 'عرض جغرافیایی',
  longitude: 'طول جغرافیایی',
  property_type: 'نوع و کاربری ملک',
  room_count: 'تعداد اتاق',
  area: 'متراژ',
  build_year: 'سال ساخت',
  bathroom: 'سرویس بهداشتی',
  heating: 'سیستم گرمایش',
  cooling: 'سیستم سرمایش',
  flooring: 'کف‌پوش',
  max_tenants: 'حداکثر تعداد مستاجر',
  other_facilities: 'امکانات دیگر',
  kitchen: 'آشپزخانه',
  property_characteristics: 'ویژگی‌های ملک',
  floor: 'طبقه',
  total_floors: 'تعداد کل طبقات',
  occupancy_status: 'وضعیت سکونت',
  parking_type: 'نوع پارکینگ',
  parking_count: 'تعداد پارکینگ',
  visit_time: 'زمان بازدید',
  evacuation_date: 'تاریخ تخلیه',
  label_ids: 'برچسب‌ها',
  elevator: 'آسانسور',
  storage: 'انباری',
  parking: 'پارکینگ',
  renovated: 'نوسازی شده',
  property_image_file_ids: 'تصاویر ملک',
  landlord_agreed_to_remove_ad: 'رضایت موجر برای حذف آگهی',
  monopoly: 'مونوپولی',
  reason_for_not_removing_ad: 'دلیل حذف نشدن آگهی',
  divar_ad_link: 'لینک آگهی دیوار',
  eitaa_ad_link: 'لینک آگهی ایتا',
  ad_title: 'عنوان آگهی',
  family_members_count: 'تعداد اعضای خانواده',
  children_ages_description: 'توضیح سن کودکان',
  tenant_deadline: 'مهلت مستاجر',
  job: 'شغل',
  payment_method: 'روش پرداخت',
}

// TODO: I should fix this warning
export const formatActivityValue = (value, entityField) => {
  if (value === 'None') return '--'
  if (value === 'True') return 'بله'
  if (value === 'False') return 'خیر'

  const mapArrayToLabels = (array, options) =>
    array.map((v) => translateEnum(options, v) || v).join(' - ')

  switch (entityField) {
    case 'build_year':
      return format(value, 'yyyy')

    case 'file_status':
      return FileStatusLabels[value] || value

    case 'gender':
      return userGenderTranslation[value] || value

    case 'deposit':
    case 'rent':
    case 'budget':
    case 'sale_price':
      return numberSeparator(value)

    case 'payment_method':
    case 'sale_payment_method':
      return paymentMethodLabels[value] || value

    case 'property_type':
      return translateEnum(PropertyTypeOptions, value) || value

    case 'bathroom':
      return Array.isArray(value) ? mapArrayToLabels(value, PropertyRestroomTypeOptions) : value

    case 'kitchen':
      return Array.isArray(value) ? mapArrayToLabels(value, PropertyKitchenTypeOptions) : value

    case 'heating':
      return Array.isArray(value)
        ? mapArrayToLabels(value, PropertyHeatingSystemTypeOptions)
        : value

    case 'cooling':
      return Array.isArray(value)
        ? mapArrayToLabels(value, PropertyCoolingSystemTypeOptions)
        : value

    case 'flooring':
      return Array.isArray(value) ? mapArrayToLabels(value, PropertyFlooringTypeOptions) : value

    case 'other_facilities':
      return Array.isArray(value) ? mapArrayToLabels(value, PropertyFacilitiesTypeOptions) : value

    case 'property_characteristics':
      return Array.isArray(value)
        ? mapArrayToLabels(value, PropertyCharacteristicsTypeOptions)
        : value

    case 'parking_type':
      return translateEnum(PropertyParkingTypeOptions, value) || value

    case 'occupancy_status':
      return translateEnum(PropertyOccupancyStatusOptions, value) || value

    case 'evacuation_date':
      return format(value, 'yyyy/MM/dd')

    case 'district_ids':
      return Array.isArray(value) ? value.join(' - ') : value

    case 'property_image_file_ids':
      return 'تصاویر ملک تغییر کرده است'

    case 'monopoly':
      return MonopolyLabels[value] || value

    case 'label_ids':
      return Array.isArray(value) ? value.join(' - ') : value

    default:
      return value
  }
}

export const ActivityTab = ({ fileId }) => {
  const activityFilesQuery = useGetHistoryFiles(fileId)
  const activities = activityFilesQuery.data || []

  return (
    <LoadingAndRetry query={activityFilesQuery}>
      {activities.length > 0 ? (
        <ul>
          {activities.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 p-2 border-b border-gray-200 fa"
            >
              {item.entity_field === 'created_by' ? (
                <span className="text-nowrap mx-auto">
                  این فایل توسط <b>{item.user?.fullname}</b> در تاریخ{' '}
                  <b>{format(item.created_at, 'yyyy/MM/dd - HH:mm')}</b> ایجاد شد.
                </span>
              ) : (
                <>
                  <span className="text-nowrap">{labels[item.entity_field]}</span>
                  <span className="text-[#B3B3B3] text-nowrap text-center">
                    {format(item.created_at, 'yyyy/MM/dd - HH:mm')} ({item.user?.fullname})
                  </span>
                  <div className="flex items-center flex-nowrap justify-end gap-2.5">
                    <span>{formatActivityValue(item.old_value, item.entity_field)}</span>
                    <span>{'>'}</span>
                    <span>{formatActivityValue(item.new_value, item.entity_field)}</span>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-4">
          هیچ فعالیتی برای این فایل ثبت نشده است.
        </div>
      )}
    </LoadingAndRetry>
  )
}
