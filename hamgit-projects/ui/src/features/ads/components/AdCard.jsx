import Image from 'next/image'
import Link from 'next/link'
import { formatDistance } from 'date-fns-jalali'
import { AdPropertyTypeEnums } from '@/data/enums/ad_property_type_enums'
import { createAdLink } from '../libs/adLink'
import { LocationIcon, MeterIcon, TagIcon, TomanIcon } from '@/components/icons'
import { numberSeparator, toPersianNumber } from '@/utils/number'
import { AdStatusEnumsTranslations } from '@/data/enums/ad_status_enum'
import BookmarkAndShare from '../../requirements/components/BookmarkAndShare'
import { AdTypeEnums } from '@/data/enums/ad_type_enums'
import { NoImageIcon } from '@/components/icons/NoImageIcon'

export default function AdCard({ ad, showStatus }) {
  const link = createAdLink(ad.type, ad.category, ad.id)

  return (
    <div className="relative">
      <Link
        key={ad.id}
        className="bg-white rounded-[16px] p-2 text-[12px] shadow-[0_8px_32px_0_#21212114] block"
        href={link}
      >
        <div className="bg-[#D9D9D9] h-[160px] rounded-[10px] overflow-hidden relative">
          {ad.images?.length > 0 && ad.images[0].url ? (
            <Image
              src={ad.images[0].url}
              alt=""
              width={300}
              height={160}
              className="object-none object-center w-full h-full"
            />
          ) : (
            <NoImageIcon
              size={60}
              color="#6D6D6D"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </div>
        <div className="flex flex-col pb-3 pt-5 gap-1 px-3">
          <div className="flex gap-2 items-center">
            <LocationIcon className="text-gray-500" size={20} />
            <span className="line-clamp-1">{ad.district?.name}</span>
          </div>
          <div className="flex gap-2">
            <TagIcon className="text-gray-500" size={20} />
            <div>
              {ad.type === AdPropertyTypeEnums.FOR_RENT ? (
                <>
                  <div className="flex">
                    <span>ودیعه : {toPersianNumber(numberSeparator(ad.deposit_amount))}</span>
                    <TomanIcon className="text-gray-300" size={15} />
                  </div>
                  <div className="flex">
                    <span>اجاره : {toPersianNumber(numberSeparator(ad.rent_amount))}</span>
                    <TomanIcon className="text-gray-300" size={15} />
                  </div>
                </>
              ) : (
                <div className="flex">
                  <span>قیمت : {toPersianNumber(numberSeparator(ad.sale_price))}</span>
                  <TomanIcon className="text-gray-300" size={15} />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <MeterIcon className="text-gray-500" size={20} />
            <span>{toPersianNumber(numberSeparator(ad.property?.area))} متر</span>
          </div>
        </div>
      </Link>
      <div className="bg-black/50 absolute left-2 top-2 rounded-[10px] px-2 py-0.5 flex items-center gap-2">
        {showStatus && (
          <div className="text-gray-300 text-xs">{AdStatusEnumsTranslations[ad.status]}</div>
        )}
        {ad?.accepted_at && (
          <p className="text-gray-300 text-xs">
            {formatDistance(new Date(ad.accepted_at), new Date(), { addSuffix: true })}
          </p>
        )}
        {!showStatus && (
          <BookmarkAndShare
            adType={AdTypeEnums.AD}
            adId={ad.id}
            isSaved={ad.is_saved}
            adPropertyType={ad.type}
            adCategory={ad.category}
          />
        )}
      </div>
    </div>
  )
}
