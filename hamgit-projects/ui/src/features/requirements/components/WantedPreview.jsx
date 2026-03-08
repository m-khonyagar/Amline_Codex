import { useState } from 'react'
import { formatDistance } from 'date-fns-jalali'
import { useRouter } from 'next/router'
// import profileImg from '@/assets/images/profile.svg'
import { RequirementTypeEnums } from '@/data/enums/requirement_type_enums'
import {
  BedroomIcon,
  LocationIcon,
  MeterIcon,
  MountainLocationIcon,
  TomanIcon,
} from '@/components/icons'
import { numberSeparator } from '@/utils/number'
import { formatYear } from '@/utils/time'
import { intersperse } from '@/utils/dom'
import { propertyTypesOptions } from '../../contract/libs/property-constants'
import AdsReport from './AdsReport'
import { AdCategoryEnums } from '@/data/enums/ad_category_enums'
import { BottomCTA } from '@/features/app'
import Button from '@/components/ui/Button'
import RequirementContactModal from '../../../components/ui/Modal/RequirementContactModal'
import BookmarkAndShare from './BookmarkAndShare'
import { AdTypeEnums } from '@/data/enums/ad_type_enums'
import { getRequirementTitle } from '../libs/requirementTitle'
import { EntityTypeEnums } from '@/data/enums/entity_type_enums'

export default function WantedPreview({ requirement, children, _defaultNickName }) {
  const router = useRouter()
  const [isShowContactModal, setIsShowContactModal] = useState(false)
  const isRent = requirement?.type === RequirementTypeEnums.RENTAL

  const handleChat = () =>
    router.push(
      `/chat?user_id=${requirement?.user_id}&entity_type=${EntityTypeEnums.REQUIREMENT}&entity_id=${requirement?.id}`
    )

  return (
    <div className="px-7 fa">
      <div className="pt-7">
        <div className="flex justify-start gap-3 items-start mb-4">
          {/* <Image
            alt={requirement.nick_name || 'avatar'}
            src={profileImg.src}
            width={32}
            height={32}
          /> */}

          {/* <p className="ml-auto text-gray-900">{defaultNickName || requirement?.nick_name}</p> */}

          <div className="font-semibold ml-auto">
            {requirement?.title || getRequirementTitle(requirement.type, requirement.property_type)}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {requirement.accepted_at && (
              <p className="text-gray-300 text-xs">
                {formatDistance(new Date(requirement.accepted_at), new Date(), { addSuffix: true })}
              </p>
            )}

            <BookmarkAndShare
              adType={AdTypeEnums.WANTED_AD}
              adId={requirement.id}
              isSaved={requirement.is_saved}
            />
          </div>
        </div>
      </div>

      <div className="border-y flex p-3.5 justify-around text-gray-500">
        <div className="flex justify-center flex-col items-center gap-2">
          <LocationIcon size={28} className="text-gray-200" />
          <span className="text-xs">شهر مورد نیاز</span>
          <span className="text-black font-medium">
            {requirement.city?.province}
            {' - '}
            {requirement.city?.name}
          </span>
        </div>
        <div className="border-r" />
        <div className="flex justify-center flex-col items-center gap-2">
          <MeterIcon size={28} className="text-gray-200" />
          <span className=" text-xs">متراژ</span>
          <span className="text-black font-medium">
            {numberSeparator(requirement.min_size)} متر
          </span>
        </div>
        <div className="border-r" />
        <div className="flex justify-center flex-col items-center gap-2">
          <BedroomIcon size={28} className="text-gray-200" />
          <span className="text-xs">تعداد اتاق ها</span>
          <span className="text-black font-medium">
            {requirement.room_count > 0 ? `${requirement.room_count} اتاق` : 'بدون اتاق'}
          </span>
        </div>
      </div>

      {isRent ? (
        <>
          <div className="flex items-center border-b py-2">
            <span className="ml-auto">ودیعه</span>
            <span>{numberSeparator(requirement.max_deposit)}</span>
            <TomanIcon size={20} className="text-gray-300" />
          </div>
          <div className="flex items-center border-b py-2">
            <span className="ml-auto">اجاره</span>
            <span>{numberSeparator(requirement.max_rent)}</span>
            <TomanIcon size={20} className="text-gray-300" />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center border-b py-2">
            <span className="ml-auto">قیمت کل</span>
            <span>{numberSeparator(requirement.sale_price)}</span>
            <TomanIcon size={20} className="text-gray-300" />
          </div>
          {requirement.construction_year && (
            <div className="flex items-center border-b py-2">
              <span className="ml-auto">سال ساخت</span>
              <span>{formatYear(requirement.construction_year)}</span>
            </div>
          )}
        </>
      )}

      <div className="flex items-center border-b py-2">
        <span className="ml-auto">کاربری</span>
        <span>
          {intersperse(
            requirement.property_type.map(
              (id) => propertyTypesOptions.find((item) => item.value === id).label
            ),
            ' ، '
          )}
        </span>
      </div>

      {requirement.districts_list.length > 0 && (
        <div className="flex items-center border-b py-2 relative">
          <MountainLocationIcon className="text-gray-200 ml-2" />
          <span>
            {intersperse(
              requirement.districts_list.map((district) => district.name),
              ' / '
            )}
          </span>
        </div>
      )}

      {requirement.parking || requirement.storage_room || requirement.elevator ? (
        <div className="mt-3 border-b">
          <h3 className="font-medium text-lg mb-3">امکانات مورد نیاز:</h3>
          <div className="flex gap-1 text-sm flex-wrap mb-3.5">
            {requirement.parking && <div className="bg-gray-200 rounded-lg py-2 px-4">پارکینگ</div>}
            {requirement.storage_room && (
              <div className="bg-gray-200 rounded-lg py-2 px-4">انباری</div>
            )}
            {requirement.elevator && (
              <div className="bg-gray-200 rounded-lg py-2 px-4">آسانسور</div>
            )}
          </div>
        </div>
      ) : null}

      <div className="my-3">
        <h3 className="font-medium text-lg mb-3">توضیحات</h3>
        <p>{requirement.description}</p>
      </div>

      {requirement?.id && (
        <div className="border-y py-2">
          <AdsReport adId={requirement?.id} adCategory={AdCategoryEnums.WANTED_AD} />
        </div>
      )}

      <BottomCTA>
        {children || (
          <div className="flex gap-2 px-2">
            {/* <Button className="w-full" onClick={handleChat}>
              چت
            </Button> */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsShowContactModal(true)}
            >
              تماس
            </Button>
          </div>
        )}
      </BottomCTA>

      <RequirementContactModal
        requirement={requirement}
        open={isShowContactModal}
        onClose={() => setIsShowContactModal(false)}
      />
    </div>
  )
}
