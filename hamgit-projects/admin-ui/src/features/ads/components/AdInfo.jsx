import { useState } from 'react'
import { format } from 'date-fns-jalali'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useGetAdInfo } from '../api/get-ad-info'
import { useAcceptAd, useDeArchiveAd, useRejectAd } from '../api/status-ads'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import { intersperse } from '@/utils/dom'
import { handleErrorOnSubmit } from '@/utils/error'
import { numberSeparator } from '@/utils/number'
import { PropertyFacilitiesTypeOptions, PropertyTypeOptions } from '@/data/enums/property-enums'
import {
  AdPropertyTypeTranslation,
  AdStatusEnums,
  AdStatusEnumsTranslations,
  propertyAdCategoryTranslation,
} from '@/data/enums/ads_enums'
import { userGenderTranslation } from '@/data/enums/user-enums.js'
import { RequirementTypeEnums } from '@/data/enums/requirement_enums'
import { Dialog } from '@/components/ui/Dialog'
import AdsListDelete from './AdsList/AdsListDelete'
import ImagePreview from '@/components/ui/ImagePreview'
import { useDownloadFile } from '@/data/api/file'

const formattedDate = (date, formatStr) => {
  return date ? format(date.toString(), formatStr || 'HH:mm   yyyy-MM-dd') : '--'
}

const AdInfo = ({ adId }) => {
  const getAdsQuery = useGetAdInfo(adId)
  const navigate = useNavigate()

  const ad = getAdsQuery.data || {}

  const propertyType = PropertyTypeOptions.find((i) => i.value === ad?.property?.property_type)
  const otherFacilities = (ad?.property?.other_facilities || []).map(
    (i) => PropertyFacilitiesTypeOptions.find((p) => p.value === i).label
  )
  const isArchived = ad?.status === AdStatusEnums.ARCHIVED
  const isAccepted = ad?.status === AdStatusEnums.PUBLISHED

  const deArchive = useDeArchiveAd()
  const acceptAd = useAcceptAd()
  const rejectAd = useRejectAd()

  const downloadFileMutation = useDownloadFile()

  const [selectedAdForDelete, setSelectedAdForDelete] = useState(null)

  const handleDeArchive = () => {
    deArchive.mutate(ad.id, {
      onSuccess: () => toast.success('آگهی با موفقیت بازیابی شد'),
      onError: handleErrorOnSubmit,
    })
  }

  const handleAccept = () => {
    acceptAd.mutate(ad.id, {
      onSuccess: () => toast.success('آگهی با موفقیت منتشر شد'),
      onError: handleErrorOnSubmit,
    })
  }

  const handleReject = () => {
    rejectAd.mutate(ad.id, {
      onSuccess: () => toast.success('آگهی با موفقیت رد شد'),
      onError: handleErrorOnSubmit,
    })
  }

  const handleDelete = () => setSelectedAdForDelete(ad)

  const tableData = [
    ['شناسه', ad.id],
    ['نوع', AdPropertyTypeTranslation[ad.type]],
    ['دسته بندی', propertyAdCategoryTranslation[ad.category]],
    ['وضعیت', AdStatusEnumsTranslations[ad.status]],
    ['نام', ad.title],
    ['استان', ad.city?.province],
    ['شهر', ad.city?.name],
    ['محله', ad.district?.name],
    ['ایجاد شده توسط ادمین', ad.created_by_admin ? 'بله' : 'خیر'],
    ['توضیحات', ad.description],
    ['تاریخ تایید', formattedDate(ad.accepted_at)],
    ['تاریخ رد', formattedDate(ad.rejected_at)],
    ['گزارش تخلف', ad.report_description],

    ...(ad?.type === RequirementTypeEnums.FOR_SALE
      ? [['قیمت', numberSeparator(ad.sale_price)]]
      : [
          ['رهن', numberSeparator(ad.deposit_amount)],
          ['اجاره', numberSeparator(ad.rent_amount)],
          ['قابل تبدیل', ad.dynamic_amounts ? 'بله' : 'خیر'],
        ]),
  ]

  const propertyData = [
    ['تعداد اتاق', ad.property?.number_of_rooms],
    ['متراژ', `${ad.property?.area} متر`],
    ['آسانسور', ad.property?.elevator ? 'دارد' : 'ندارد'],
    ['انباری', ad.property?.storage_room ? 'دارد' : 'ندارد'],
    ['پارکینگ', ad.property?.parking ? 'دارد' : 'ندارد'],
    ['بازسازی شده', ad.property?.is_rebuilt ? 'بله' : 'خیر'],
    ['کاربری', propertyType?.label],
    ['سال ساخت', formattedDate(ad.property?.build_year, 'yyyy')],
    ['سایر امکانات', intersperse(otherFacilities, ' , ')],
  ]

  const userData = [
    ['شناسه', ad.user?.id],
    ['موبایل', ad.user?.mobile],
    ['نام', ad.user?.first_name],
    ['نام خانوادگی', ad.user?.last_name],
    ['نام پدر', ad.user?.father_name],
    ['تاریخ تولد', formattedDate(ad.user?.birth_date)],
    ['کد ملی', ad.user?.national_code],
    ['جنسیت', userGenderTranslation[ad.user?.gender]],
    ['نام مستعار', ad.user?.nick_name],
    ['کد پستی', ad.user?.postal_code],
    ['ایمیل', ad.user?.email],
    ['ادرس', ad.user?.address],
    ['کاربر فعال', ad.user?.is_active ? 'بله' : 'خیر'],
    ['کاربر تایید شده', ad.user?.is_verified ? 'بله' : 'خیر'],
  ]

  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6 gap-2">
        <Button variant="outline" size="sm" href={`/ads/list/${adId}/edit`}>
          ویرایش
        </Button>

        {isArchived ? (
          <Button onClick={handleDeArchive} size="sm" loading={deArchive.isPending}>
            بازیابی
          </Button>
        ) : isAccepted ? (
          <Button onClick={handleReject} size="sm" variant="danger" loading={rejectAd.isPending}>
            لغو انتشار
          </Button>
        ) : (
          <Button onClick={handleAccept} size="sm" loading={acceptAd.isPending}>
            انتشار
          </Button>
        )}

        <Button onClick={handleDelete} size="sm" variant="danger">
          حذف
        </Button>
      </div>

      <div className="w-full flex justify-evenly flex-wrap gap-14">
        <div className="max-w-[450px] w-full">
          <h3 className="font-medium text-2xl mb-3">اطلاعات آگهی</h3>
          <div className="bg-white border rounded-lg divide-y fa">
            <LoadingAndRetry query={getAdsQuery}>
              {ad && (
                <>
                  {tableData.map((item, index) => (
                    <div key={index} className="flex py-2 px-4 flex-wrap">
                      <div className="text-sm text-gray-700 py-1">{item[0]}</div>
                      <div className="mr-auto py-1">{item[1] || '--'}</div>
                    </div>
                  ))}
                </>
              )}
            </LoadingAndRetry>
          </div>
        </div>

        <div className="max-w-[450px] w-full">
          <h3 className="font-medium text-2xl mb-3">اطلاعات ملک</h3>
          <div className="bg-white border rounded-lg divide-y fa">
            <LoadingAndRetry query={getAdsQuery}>
              {ad && (
                <>
                  {propertyData.map((item, index) => (
                    <div key={index} className="flex py-2 px-4 flex-wrap">
                      <div className="text-sm text-gray-700 py-1">{item[0]}</div>
                      <div className="mr-auto py-1">{item[1] || '--'}</div>
                    </div>
                  ))}
                </>
              )}
            </LoadingAndRetry>
          </div>
        </div>

        <div className="max-w-[450px] w-full">
          <h3 className="font-medium text-2xl mb-3">اطلاعات کاربر</h3>
          <div className="bg-white border rounded-lg divide-y fa">
            <LoadingAndRetry query={getAdsQuery}>
              {ad && (
                <>
                  {userData.map((item, index) => (
                    <div key={index} className="flex py-2 px-4 flex-wrap">
                      <div className="text-sm text-gray-700 py-1">{item[0]}</div>
                      <div className="mr-auto py-1">{item[1] || '--'}</div>
                    </div>
                  ))}
                </>
              )}
            </LoadingAndRetry>
          </div>
        </div>
      </div>

      {ad.images?.length > 0 && (
        <div className="flex flex-wrap gap-6 mt-8">
          {ad.images?.map((image) => (
            <ImagePreview
              key={image.id}
              file={image}
              className="w-56 shadow-md"
              downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
            />
          ))}
        </div>
      )}

      <Dialog
        title="حذف آگهی"
        closeOnBackdrop={false}
        open={selectedAdForDelete}
        onOpenChange={(s) => setSelectedAdForDelete(s)}
      >
        <AdsListDelete
          ad={selectedAdForDelete}
          onCancel={() => setSelectedAdForDelete(null)}
          onSuccess={() => {
            setSelectedAdForDelete(null)
            navigate(-1)
          }}
        />
      </Dialog>
    </div>
  )
}

export default AdInfo
