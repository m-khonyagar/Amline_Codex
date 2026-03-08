import { format } from 'date-fns-jalali'
import {
  PropertyCoolingSystemTypeOptions,
  PropertyFacilitiesTypeOptions,
  PropertyFlooringTypeOptions,
  PropertyHeatingSystemTypeOptions,
  PropertyRestroomTypeOptions,
  PropertyTypeOptions,
  PropertyCharacteristicsTypeOptions,
  PropertyOccupancyStatusOptions,
  PropertyParkingTypeOptions,
  PropertyKitchenTypeOptions,
} from '@/data/enums/property-enums'
import { numberSeparator } from '@/utils/number'
import { translateEnum } from '@/utils/enum'
import { MarketRole, MonopolyOptions } from '@/data/enums/market_enums'
import { paymentMethodOptions } from '@/data/enums/prcontract-enums'
import { useDownloadFile } from '@/features/misc'
import LocationPreview from '@/components/ui/Location/LocationPreview'
import ImagePreview from '@/components/ui/ImagePreview'

export const DepositRentFileInfo = ({ fileInfo }) => {
  const downloadFileMutation = useDownloadFile()

  return (
    <div className="grid lg:grid-cols-2 gap-y-24">
      <div className="space-y-4 px-6 lg:border-l border-black/20">
        <div className="space-y-4">
          <p className="text-lg font-medium border-b pb-2">اطلاعات پایه ملک</p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">نوع و کاربری ملک: </span>
            <span className="text-left">
              {translateEnum(PropertyTypeOptions, fileInfo?.property_type) || '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">
              {fileInfo.role === MarketRole.TENANT && 'حداقل'} تعداد اتاق:{' '}
            </span>
            <span className="fa text-left">{fileInfo?.room_count || 'ندارد'}</span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">
              {fileInfo.role === MarketRole.TENANT && 'حداقل'} متراژ:{' '}
            </span>
            <span className="fa text-left">{fileInfo?.area ? `${fileInfo?.area} متر` : '--'}</span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">
              {fileInfo.role === MarketRole.TENANT && 'حداقل'} سال ساخت:{' '}
            </span>
            <span className="fa text-left">
              {fileInfo?.build_year ? format(`${fileInfo.build_year}-06-01`, 'yyyy') : '--'}
            </span>
          </p>

          {fileInfo.role === MarketRole.LANDLORD && (
            <>
              <p className="flex items-center justify-between gap-8">
                <span className="text-nowrap">طبقه: </span>
                <span className="fa text-left">{fileInfo?.floor || '--'}</span>
              </p>

              <p className="flex items-center justify-between gap-8">
                <span className="text-nowrap">تعداد کل طبقات: </span>
                <span className="fa text-left">{fileInfo?.total_floors || '--'}</span>
              </p>

              <p className="flex items-center justify-between gap-8">
                <span className="text-nowrap">وضعیت سکونت: </span>
                <span className="text-left">
                  {translateEnum(PropertyOccupancyStatusOptions, fileInfo?.occupancy_status) ||
                    '--'}
                </span>
              </p>

              <p className="flex items-center justify-between gap-8">
                <span className="text-nowrap">تاریخ تخلیه: </span>
                <span className="fa text-left">
                  {fileInfo?.evacuation_date
                    ? format(fileInfo.evacuation_date, 'yyyy/MM/dd')
                    : '--'}
                </span>
              </p>

              <p className="flex items-center justify-between gap-8">
                <span className="text-nowrap">زمان بازدید: </span>
                <span className="text-left">{fileInfo?.visit_time || '--'}</span>
              </p>

              <p className="flex items-center justify-between gap-8">
                <span className="text-nowrap">به چند نفر اجاره میدهد؟: </span>
                <span className="fa text-left">{fileInfo?.max_tenants || '--'}</span>
              </p>

              <p className="flex items-center justify-between gap-8">
                <span className="text-nowrap">مشخصه ملک: </span>
                <span className="text-left">
                  {fileInfo?.property_characteristics
                    ?.map((value) => translateEnum(PropertyCharacteristicsTypeOptions, value))
                    .filter(Boolean)
                    .join(' - ') || '--'}
                </span>
              </p>
            </>
          )}
        </div>

        <div className="space-y-4 pt-6">
          <p className="text-lg font-medium border-b pb-2">امکانات و تجهیزات</p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">سرویس بهداشتی: </span>
            <span className="text-left">
              {fileInfo?.bathroom
                ?.map((value) => translateEnum(PropertyRestroomTypeOptions, value))
                .filter(Boolean)
                .join(' - ') || '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">سیستم گرمایشی: </span>
            <span className="text-left">
              {fileInfo?.heating
                ?.map((value) => translateEnum(PropertyHeatingSystemTypeOptions, value))
                .filter(Boolean)
                .join(' - ') || '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">سیستم سرمایش: </span>
            <span className="text-left">
              {fileInfo?.cooling
                ?.map((value) => translateEnum(PropertyCoolingSystemTypeOptions, value))
                .filter(Boolean)
                .join(' - ') || '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">نوع کفپوش: </span>
            <span className="text-left">
              {fileInfo?.flooring
                ?.map((value) => translateEnum(PropertyFlooringTypeOptions, value))
                .filter(Boolean)
                .join(' - ') || '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">آشپزخانه: </span>
            <span className="text-left">
              {fileInfo?.kitchen
                ?.map((value) => translateEnum(PropertyKitchenTypeOptions, value))
                .filter(Boolean)
                .join(' - ') || '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">سایر امکانات: </span>
            <span className="text-left">
              {fileInfo?.other_facilities
                ?.map((value) => translateEnum(PropertyFacilitiesTypeOptions, value))
                .filter(Boolean)
                .join(' - ') || '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">نوع پارکینگ: </span>
            <span className="text-left">
              {translateEnum(PropertyParkingTypeOptions, fileInfo?.parking_type) || '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">تعداد پارکینگ: </span>
            <span className="fa text-left">{fileInfo?.parking_count || '--'}</span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">آسانسور: </span>
            <span className="text-left">{fileInfo?.elevator ? 'دارد' : 'ندارد'}</span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">انباری: </span>
            <span className="text-left">{fileInfo?.storage ? 'دارد' : 'ندارد'}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4 px-6">
        <div className="space-y-4">
          <p className="text-lg font-medium border-b pb-2">
            آدرس ملک {fileInfo.role === MarketRole.TENANT && 'درخواستی'}
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">شهر: </span>
            <span className="text-left">
              {fileInfo?.city ? `${fileInfo?.city?.province} - ${fileInfo?.city?.name}` : '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">محله: </span>
            <span className="text-left">
              {fileInfo.role === MarketRole.LANDLORD && <>{fileInfo?.district?.name || '--'}</>}
              {fileInfo.role === MarketRole.TENANT && (
                <>{fileInfo?.districts?.map((i) => i.name).join(' - ') || '--'}</>
              )}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">منطقه: </span>
            <span className="text-left fa">
              {fileInfo.role === MarketRole.LANDLORD && <>{fileInfo?.region || '--'}</>}
              {fileInfo.role === MarketRole.TENANT && <>{fileInfo?.regions?.join(' - ') || '--'}</>}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">جزئیات آدرس: </span>
            <span className="text-left">
              {fileInfo?.address || fileInfo?.address_description || '--'}
            </span>
          </p>

          {fileInfo?.latitude && fileInfo?.longitude && (
            <div className="space-y-2">
              <p className="text-sm font-medium">موقعیت جغرافیایی:</p>
              <LocationPreview
                position={[fileInfo.latitude, fileInfo.longitude]}
                height="160px"
                zoom={16}
                className="rounded-lg overflow-hidden border max-w-md mr-auto"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 pt-6">
          {fileInfo.role === MarketRole.LANDLORD && (
            <p className="text-lg font-medium border-b pb-2">مبلغ</p>
          )}

          {fileInfo.role === MarketRole.TENANT && (
            <p className="text-lg font-medium border-b pb-2">توانایی پرداخت</p>
          )}

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">
              {fileInfo.role === MarketRole.TENANT && 'حداکثر'} مبلغ رهن:{' '}
            </span>
            <span className="fa text-left">
              {fileInfo?.deposit ? numberSeparator(fileInfo.deposit) : '--'}
            </span>
          </p>

          <p className="flex items-center justify-between gap-8">
            <span className="text-nowrap">
              {fileInfo.role === MarketRole.TENANT && 'حداکثر'} مبلغ اجاره:{' '}
            </span>
            <span className="fa text-left">
              {fileInfo?.rent ? numberSeparator(fileInfo.rent) : '--'}
            </span>
          </p>

          {fileInfo.role === MarketRole.LANDLORD && (
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">قابل تبدیل: </span>
              <span className="text-left">{fileInfo?.dynamic_amount ? 'هست' : 'نیست'}</span>
            </p>
          )}

          {fileInfo.role === MarketRole.TENANT && (
            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">نحوه پرداخت: </span>
              <span className="text-left">
                {translateEnum(paymentMethodOptions, fileInfo?.payment_method) || '--'}
              </span>
            </p>
          )}
        </div>

        {fileInfo.role === MarketRole.LANDLORD && (
          <div className="space-y-4 pt-6">
            <p className="text-lg font-medium border-b pb-2">تصاویر و انتشار</p>

            <div className="flex items-center justify-between gap-8">
              <span className="text-nowrap">تصاویر ملک: </span>
              <span className="flex gap-2 flex-wrap justify-end text-left">
                {Array.isArray(fileInfo?.images) && fileInfo.images.length > 0
                  ? fileInfo.images.map((img) => (
                      <ImagePreview
                        key={img.id}
                        file={img}
                        className="w-32 shadow-md"
                        downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
                      />
                    ))
                  : '--'}
              </span>
            </div>

            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">عنوان آگهی: </span>
              <span className="text-left">{fileInfo?.ad_title || '--'}</span>
            </p>

            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">منتشر شده در املاین: </span>
              <span className="text-left">{fileInfo?.published_on_amline ? 'بله' : 'خیر'}</span>
            </p>

            <p className="flex items-center justify-between gap-8">
              <span className="text-nowrap">وضعیت مونوپول: </span>
              <span className="text-left">
                {translateEnum(MonopolyOptions, fileInfo?.monopoly) || '--'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
