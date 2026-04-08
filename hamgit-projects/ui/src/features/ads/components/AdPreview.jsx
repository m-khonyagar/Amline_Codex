import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  BedroomIcon,
  CircleCheckBoldIcon,
  CloseIcon,
  HouseIcon,
  MeterIcon,
  TomanIcon,
  FrameIcon,
} from '@/components/icons'
import { numberSeparator } from '@/utils/number'
import { formatFromNow, formatYear } from '@/utils/time'
import {
  propertyFacilitiesType,
  propertyTypesOptions,
} from '../../contract/libs/property-constants'
import AdsReport from '../../requirements/components/AdsReport'
import { AdCategoryEnums } from '@/data/enums/ad_category_enums'
import { BottomCTA } from '@/features/app'
import Button from '@/components/ui/Button'
import { AdPropertyTypeEnums } from '@/data/enums/ad_property_type_enums'
import Slider from '@/components/ui/Slider'
// import { AdSupportPhone } from '@/features/home'
import { NextLocationPreview } from '@/components/ui/Location'
import { toArrayLocation } from '../libs/convertLocation'
// import useAdsVisitRequests from '../api/ads-visit-requests'
// import { handleErrorOnSubmit } from '@/utils/error'
import Modal from '@/components/ui/Modal'
import { NoImageIcon } from '@/components/icons/NoImageIcon'
import RequirementContactModal from '@/components/ui/Modal/RequirementContactModal'

const findEnumLabel = (enumOptions, value) => {
  const options = enumOptions.find((i) => i.value === value)
  return options?.label || '--'
}

export default function AdPreview({ ad, children }) {
  const isRent = ad?.type === AdPropertyTypeEnums.FOR_RENT
  const propertyType = propertyTypesOptions
    .find((item) => item.value === ad.property.property_type)
    .label.split('-')

  // const visitRequestsMutation = useAdsVisitRequests()
  const [requestSuccess, setRequestSuccess] = useState(false)
  // const handleVisitRequests = () => {
  //   visitRequestsMutation.mutate(
  //     {
  //       advertisement_id: ad.id,
  //     },
  //     {
  //       onSuccess: () => {
  //         setRequestSuccess(true)
  //       },
  //       onError: (e) => {
  //         handleErrorOnSubmit(e)
  //       },
  //     }
  //   )
  // }
  const [isShowContactModal, setIsShowContactModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const hasInitialized = useRef(false)

  const openFullscreen = () => {
    if (!hasInitialized.current) {
      setIsFullscreen(true)
      hasInitialized.current = true
      window.history.pushState({ isFullscreen: true }, '')
    } else window.history.forward()
  }

  const closeFullscreen = () => window.history.back()

  useEffect(() => {
    const handlePopState = (event) => setIsFullscreen(!!event.state?.isFullscreen)

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <>
      <div className="mb-3 bg-[#d9d9d9] relative">
        {ad.images.length > 0 ? (
          <>
            <Slider>
              {ad.images.map((img, index) => (
                <div
                  key={`_${index + 1}`}
                  className="min-w-0 flex-[0_0_100%] aspect-[12/7] min-h-[190px] max-h-[280px] relative"
                >
                  {img.url ? (
                    <Image
                      width={600}
                      height={210}
                      src={img.url}
                      alt={ad.title}
                      className="object-cover object-center w-full h-full"
                    />
                  ) : (
                    <NoImageIcon
                      size={60}
                      color="#6D6D6D"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                  )}
                </div>
              ))}
            </Slider>

            <button
              type="button"
              aria-label="remove"
              onClick={openFullscreen}
              className="absolute bottom-2 left-2 bg-black/50 p-2 rounded-[10px] text-[#D9D9D9] flex gap-2.5 items-center fa text-sm"
            >
              {ad.images.length}
              <FrameIcon size={14} />
            </button>
          </>
        ) : (
          <div className="min-h-[280px] relative">
            <NoImageIcon
              size={60}
              color="#6D6D6D"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        )}
      </div>

      <div className="px-6 fa mb-20">
        <div className="flex gap-1 mb-2">
          {propertyType.map((item, i) => (
            <div key={`__${i + 1}`} className="bg-gray-400 text-gray-300 rounded-lg py-2 px-4">
              {item}
            </div>
          ))}
        </div>

        <div className="mb-2.5">
          <h2 className="text-lg font-medium">{ad.title}</h2>
          <span className="text-gray-300 text-sm">
            {ad.accepted_at && formatFromNow(ad.accepted_at)}
            {` در ${ad.city.name} ${ad.district?.name || ''}`}
          </span>
        </div>

        <div className="border-y flex p-3 justify-around text-gray-500">
          <div className="flex justify-center flex-col items-center gap-2">
            <HouseIcon size={28} className="text-gray-200" />
            <span className="text-xs">سال ساخت</span>
            <strong className="text-black">
              {ad.property.build_year && formatYear(ad.property.build_year)}
            </strong>
          </div>
          <div className="border-r" />
          <div className="flex justify-center flex-col items-center gap-2">
            <MeterIcon size={28} className="text-gray-200" />
            <span className=" text-xs">متراژ</span>
            <strong className="text-black">{numberSeparator(ad.property.area)} متر</strong>
          </div>
          <div className="border-r" />
          <div className="flex justify-center flex-col items-center gap-2">
            <BedroomIcon size={28} className="text-gray-200" />
            <span className="text-xs">تعداد اتاق ها</span>
            <strong className="text-black">{ad.property.number_of_rooms || 'بدون'} اتاق</strong>
          </div>
        </div>

        {isRent ? (
          <>
            <div className="flex items-center border-b py-2">
              <span className="ml-auto">ودیعه</span>
              <span>{numberSeparator(ad.deposit_amount)}</span>
              <TomanIcon size={20} className="text-gray-300" />
            </div>
            <div className="flex items-center border-b py-2">
              <span className="ml-auto">اجاره</span>
              <span>{numberSeparator(ad.rent_amount)}</span>
              <TomanIcon size={20} className="text-gray-300" />
            </div>
            <div className="flex items-center border-b py-2">
              <span className="ml-auto">ودیعه و اجاره</span>
              <span>{ad.dynamic_amounts ? 'قابل تبدیل' : 'غیر قابل تبدیل'}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center border-b py-2">
            <span className="ml-auto">قیمت</span>
            <span>{numberSeparator(ad.sale_price)}</span>
            <TomanIcon size={20} className="text-gray-300" />
          </div>
        )}

        {ad.property.is_rebuilt && (
          <div className="flex items-center border-b py-2">
            <span className="ml-auto">وضعیت</span>
            <span>بازسازی شده</span>
          </div>
        )}

        <div className="my-3 border-b">
          <h3 className="font-medium text-lg mb-3">امکانات</h3>
          <div className="flex gap-1 flex-wrap text-sm mb-3 text-gray-500">
            {ad.property.parking && (
              <div className="bg-[#F2F4FA] rounded-lg py-2 px-4">پارکینگ</div>
            )}
            {ad.property.storage_room && (
              <div className="bg-[#F2F4FA] rounded-lg py-2 px-4">انباری</div>
            )}
            {ad.property.elevator && (
              <div className="bg-[#F2F4FA] rounded-lg py-2 px-4">آسانسور</div>
            )}

            {(ad.property.other_facilities || []).map((item) => (
              <div className="bg-[#F2F4FA] rounded-lg py-2 px-4" key={item}>
                {findEnumLabel(propertyFacilitiesType, item)}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-lg">توضیحات</h3>
          <p>{ad.description}</p>
        </div>

        {!!ad.location?.lat && (
          <NextLocationPreview className="mb-4" position={toArrayLocation(ad.location)} />
        )}

        {ad?.id && (
          <div className="border-y py-2">
            <AdsReport adId={ad?.id} adCategory={AdCategoryEnums.AD} />
          </div>
        )}

        <BottomCTA>
          {children || (
            <div className="flex gap-2 px-2">
              {/* <Button
                className="w-full"
                onClick={handleVisitRequests}
                loading={visitRequestsMutation.isPending}
              >
                درخواست بازدید
              </Button> */}
              <Button className="w-full" onClick={() => setIsShowContactModal(true)}>
                تماس
              </Button>
              {/* <Button
                href={`tel:${AdSupportPhone.value}`}
                type="tel"
                variant="outline"
                className="w-full"
              >
                ارتباط با کارشناس
              </Button> */}
            </div>
          )}
        </BottomCTA>
      </div>
      <RequirementContactModal
        requirement={ad.user}
        open={isShowContactModal}
        onClose={() => setIsShowContactModal(false)}
      />
      <Modal className="py-3 px-4" open={requestSuccess} onClose={() => setRequestSuccess(false)}>
        <div className="">
          <div className="mt-5 mb-4 text-success ">
            <CircleCheckBoldIcon size={47} className="mx-auto" />
          </div>
          <p className="text-center mb-5">
            درخواست شما با موفقیت ثبت شد.
            <br />
            کارشناس های املاین به زودی با شما تماس خواهند گرفت.
          </p>
          <Button className="w-full" onClick={() => setRequestSuccess(false)}>
            تایید
          </Button>
        </div>
      </Modal>

      {isFullscreen && (
        <div className="fixed bg-[#474747] bg-opacity-90 z-[999] top-0 left-0 h-screen w-screen">
          <Slider>
            {ad.images.map(
              (img, index) =>
                img.url && (
                  <div key={`_${index + 1}`} className="h-screen w-screen flex-[0_0_100%] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={ad.title}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-full"
                    />
                  </div>
                )
            )}
          </Slider>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-6 top-3 h-10"
            onClick={closeFullscreen}
          >
            <CloseIcon size={20} />
          </Button>
        </div>
      )}
    </>
  )
}
