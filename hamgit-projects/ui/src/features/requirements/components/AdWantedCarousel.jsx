import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { BedroomIcon, LocationIcon, MeterIcon, TagIcon, TomanIcon } from '@/components/icons'
import { numberSeparator, toPersianNumber } from '@/utils/number'
import { Skeleton } from '@/components/ui/Skeleton'
import { propertyTypesOptions } from '../../contract/libs/property-constants'
import {
  RequirementTypeEnums,
  RequirementTypeEnumsTranslations,
} from '@/data/enums/requirement_type_enums'
import { intersperse } from '@/utils/dom'

function AdCarouselSkeleton() {
  return Array.from({ length: 10 }, (_, i) => i).map((id) => (
    <Skeleton key={id} className="h-[170px] min-w-[200px] bg-gray-200 rounded-lg shadow-sm p-4" />
  ))
}

export default function AdWantedCarousel({ query, ads }) {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, direction: 'rtl' })

  return (
    <div className="overflow-hidden px-7" ref={emblaRef}>
      <div className="flex gap-3">
        <LoadingAndRetry
          query={query}
          loadingComponent={AdCarouselSkeleton}
          errorClassName="mx-auto"
        >
          {ads?.map((ad) => (
            <Link
              key={ad.id}
              className="min-w-0 flex-[0_0_200px] bg-white rounded-lg shadow-sm p-4 text-sm border border-gray-200 select-none"
              href={`/requirements/${ad.id}`}
            >
              <div className="flex justify-between">
                <div>
                  {ad.property_type.length &&
                    propertyTypesOptions
                      .find((item) => item.value === ad.property_type[0])
                      .label.split('-')[0]}
                </div>
                <div className="bg-[#AEDCDC] rounded-xl px-2.5 py-1 text-black">
                  {RequirementTypeEnumsTranslations[ad.type]}
                </div>
              </div>
              <div className="flex flex-col mt-3 gap-1">
                <div className="flex gap-2 items-center">
                  <LocationIcon className="text-gray-500" size={15} />
                  <span className="line-clamp-1">
                    {intersperse(
                      [ad.city?.name, ...ad.districts_list.map((district) => district.name)],
                      ' ، '
                    )}
                  </span>
                </div>
                <div className="flex gap-2">
                  <TagIcon className="text-gray-500" size={15} />
                  <div>
                    {ad.type === RequirementTypeEnums.RENTAL ? (
                      <>
                        <div className="flex">
                          <span>ودیعه : {toPersianNumber(numberSeparator(ad.max_deposit))}</span>
                          <TomanIcon className="text-gray-300" size={15} />
                        </div>
                        <div className="flex">
                          <span>اجاره : {toPersianNumber(numberSeparator(ad.max_rent))}</span>
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
                  <MeterIcon className="text-gray-500" size={15} />
                  <span>{toPersianNumber(numberSeparator(ad.min_size))} متر</span>
                </div>
                {ad.room_count ? (
                  <div className="flex gap-2 items-center">
                    <BedroomIcon className="text-gray-500" size={15} />
                    <span className="fa">{ad.room_count} اتاق</span>
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </LoadingAndRetry>
      </div>
    </div>
  )
}
