import Link from 'next/link'
import { formatDistance } from 'date-fns-jalali'
// import profileImg from '@/assets/images/profile.svg'
// import { intersperse } from '@/utils/dom'
import { numberSeparator } from '@/utils/number'
// import { formatYear } from '@/utils/time'
import {
  TagIcon,
  MeterIcon,
  TomanIcon,
  // ParkingIcon,
  BedroomIcon,
  LocationIcon,
  // ElevatorIcon,
  // WarehouseIcon,
  // HouseQuestionIcon,
  // CalendarIcon,
} from '@/components/icons'
import { RequirementTypeEnums } from '@/data/enums/requirement_type_enums'
import { propertyTypesOptions } from '../../contract/libs/property-constants'
import { AdStatusEnumsTranslations } from '@/data/enums/ad_status_enum'
import BookmarkAndShare from './BookmarkAndShare'
import { AdTypeEnums } from '@/data/enums/ad_type_enums'
import { getRequirementTitle } from '../libs/requirementTitle'

function WantedCard({ requirement, showStatus = false }) {
  const propertiesLabel = requirement.property_type.map(
    (p) => propertyTypesOptions.find((i) => i.value === p).label
  )
  const propertyType = propertiesLabel[0]?.split('-')[0]
  // const propertyUse = propertiesLabel.map((value) => {
  //   const arr = value.split('-')
  //   return arr.length > 1 ? arr[1] : arr[0]
  // })
  const isRental = requirement.type === RequirementTypeEnums.RENTAL

  return (
    <div className="bg-background rounded-2xl fa relative shadow-xl p-4">
      <div className="flex gap-1 items-center absolute left-0 top-0 p-4">
        {showStatus && (
          <div className="text-sm text-gray-500 flex gap-1 items-center">
            {AdStatusEnumsTranslations[requirement.status]}
          </div>
        )}

        {requirement.accepted_at && (
          <p className="text-gray-300 text-xs">
            {formatDistance(new Date(requirement.accepted_at), new Date(), { addSuffix: true })}
          </p>
        )}

        {!showStatus && (
          <BookmarkAndShare
            adType={AdTypeEnums.WANTED_AD}
            adId={requirement.id}
            isSaved={requirement.is_saved}
          />
        )}
      </div>

      <Link href={`/requirements/${requirement?.id}`} className="flex flex-col">
        {/* <div className="flex justify-between mb-3">
          <div className="flex justify-start gap-3.5 items-center">
            <Image
              alt={requirement.nick_name || 'avatar'}
              src={profileImg.src}
              width={32}
              height={32}
            />
            <p className="text-grey-900">{requirement?.nick_name}</p>
          </div>
        </div> */}

        {propertyType && (
          <p className="mb-4 font-semibold ml-[105px]">
            {requirement?.title || getRequirementTitle(requirement.type, requirement.property_type)}
          </p>
        )}

        <div className="grid grid-cols-[3fr,2fr] gap-3 text-sm items-start">
          <div className="flex items-center gap-2">
            <LocationIcon size={20} className="text-gray-500" />
            <span>{requirement.city.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <MeterIcon size={20} className="text-gray-500" />
            {requirement.min_size ? (
              <span>{numberSeparator(requirement.min_size)} متر</span>
            ) : (
              <span>بدون متراژ</span>
            )}
          </div>

          {isRental ? (
            <div className="flex items-center gap-2 text-nowrap">
              <TagIcon size={20} className="text-gray-500" />
              <div className="flex items-center gap-1">
                <span>ودیعه : {numberSeparator(requirement.max_deposit)}</span>
                <TomanIcon size={20} className="text-gray-300" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-nowrap">
              <TagIcon size={20} className="text-gray-500" />
              <div className="flex items-center gap-1">
                <span>قیمت : {numberSeparator(requirement.sale_price)}</span>
                <TomanIcon size={20} className="text-gray-300" />
              </div>
            </div>
          )}

          {/* {requirement.property_type?.length > 0 && (
            <div className="flex gap-2">
              <HouseQuestionIcon size={20} className="text-gray-500" />
              <span className="mt-1">
                <span>کاربری: </span>
                {intersperse(propertyUse, ' / ')}
              </span>
            </div>
          )} */}

          {/* {requirement.type === RequirementTypeEnums.BUY && requirement.construction_year && (
            <div className="flex gap-2">
              <CalendarIcon size={20} className="text-gray-500" />
              <span>سال ساخت: </span>
              <span>{formatYear(requirement.construction_year)}</span>
            </div>
          )} */}

          <div className="flex items-center gap-2">
            <BedroomIcon size={20} className="text-gray-500" />
            {requirement.room_count > 0 ? (
              <span>{requirement.room_count} اتاق</span>
            ) : (
              <span>بدون اتاق</span>
            )}
          </div>

          {isRental && (
            <div className="flex items-center gap-2 text-nowrap">
              <TagIcon size={20} className="text-gray-500" />
              <div className="flex items-center gap-1">
                <span>اجاره : {numberSeparator(requirement.max_rent)}</span>
                <TomanIcon size={20} className="text-gray-300" />
              </div>
            </div>
          )}

          {/* {requirement.elevator === true && (
            <div className="flex gap-2">
              <ElevatorIcon size={20} className="text-gray-500" />
              <span className="mt-1">آسانسور</span>
            </div>
          )} */}

          {/* {requirement.storage_room === true && (
            <div className="flex gap-2">
              <WarehouseIcon size={20} className="text-gray-500" />
              <span className="mt-1">انباری</span>
            </div>
          )} */}

          {/* {requirement.parking === true && (
            <div className="flex gap-2">
              <ParkingIcon size={20} className="text-gray-500" />
              <span className="mt-1">پارکینگ</span>
            </div>
          )} */}
        </div>
      </Link>
    </div>
  )
}

export default WantedCard
