import Link from 'next/link'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { LocationIcon, MeterIcon, TagIcon, TomanIcon } from '@/components/icons'
import { numberSeparator, toPersianNumber } from '@/utils/number'
import { AdPropertyTypeEnums } from '@/data/enums/ad_property_type_enums'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { createAdLink } from '../libs/adLink'
import { NoImageIcon } from '@/components/icons/NoImageIcon'

function AdCarouselSkeleton() {
  return Array.from({ length: 10 }, (_, i) => i).map((id) => (
    <Skeleton key={id} className="h-[170px] min-w-[200px] bg-gray-200 rounded-lg shadow-sm p-4" />
  ))
}

export default function AdCarousel({ query, ads }) {
  const [emblaRef] = useEmblaCarousel({ dragFree: true, direction: 'rtl' })

  return (
    <div className="overflow-hidden px-7" ref={emblaRef}>
      <div className="flex gap-3">
        <LoadingAndRetry
          query={query}
          loadingComponent={AdCarouselSkeleton}
          errorClassName="mx-auto"
        >
          {ads?.map((i) => (
            <Link
              key={i.id}
              className="min-w-0 flex-[0_0_200px] bg-white rounded-lg shadow-sm p-1.5 text-sm select-none"
              href={createAdLink(i.type, i.category, i.id)}
            >
              <div className="bg-[#D9D9D9] h-[92px] rounded-md overflow-hidden relative">
                {i.images.length > 0 && i.images[0].url ? (
                  <Image
                    src={i.images[0].url}
                    alt=""
                    width={300}
                    height={92}
                    className="object-none object-center w-full h-full"
                  />
                ) : (
                  <NoImageIcon
                    size={33}
                    color="#6D6D6D"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                )}
              </div>

              <div className="flex flex-col mt-2 gap-1 px-3">
                {i.district && (
                  <div className="flex gap-2 items-center">
                    <LocationIcon className="text-gray-500" size={15} />
                    <span className="line-clamp-1">{i.district?.name}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <TagIcon className="text-gray-500" size={15} />
                  <div>
                    {i.type === AdPropertyTypeEnums.FOR_RENT ? (
                      <>
                        <div className="flex">
                          <span>ودیعه : {toPersianNumber(numberSeparator(i.deposit_amount))}</span>
                          <TomanIcon className="text-gray-300" size={15} />
                        </div>
                        <div className="flex">
                          <span>اجاره : {toPersianNumber(numberSeparator(i.rent_amount))}</span>
                          <TomanIcon className="text-gray-300" size={15} />
                        </div>
                      </>
                    ) : (
                      <div className="flex">
                        <span>قیمت : {toPersianNumber(numberSeparator(i.sale_price))}</span>
                        <TomanIcon className="text-gray-300" size={15} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <MeterIcon className="text-gray-500" size={15} />
                  <span>{toPersianNumber(numberSeparator(i.property.area))} متر</span>
                </div>
              </div>
            </Link>
          ))}
        </LoadingAndRetry>
      </div>
    </div>
  )
}
