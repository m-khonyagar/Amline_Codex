import Image from 'next/image'
import Link from 'next/link'
import { formatDistance } from 'date-fns-jalali'
import profileImg from '@/assets/images/profile.svg'
import { numberSeparator } from '@/utils/number'
import { TagIcon, TomanIcon, HandInIcon, HandOutIcon } from '@/components/icons'
import { AdStatusEnumsTranslations } from '@/data/enums/ad_status_enum'
import BookmarkAndShare from './BookmarkAndShare'
import { AdTypeEnums } from '@/data/enums/ad_type_enums'

function SwapCard({ requirement, showStatus = false }) {
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
            {formatDistance(new Date(requirement.accepted_at), new Date(), {
              addSuffix: true,
            })}
          </p>
        )}

        {!showStatus && (
          <BookmarkAndShare
            adType={AdTypeEnums.SWAP_AD}
            adId={requirement.id}
            isSaved={requirement.is_saved}
          />
        )}
      </div>

      <Link href={`/requirements/swaps/${requirement?.id}`}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex justify-start gap-3.5 items-center">
              <Image
                alt={requirement.nick_name || 'avatar'}
                src={profileImg.src}
                width={32}
                height={32}
              />
              <p className="text-grey-900">{requirement?.nick_name}</p>
            </div>
          </div>

          <h5 className="text-grey-900 font-bold">{requirement.title}</h5>

          <div className="flex">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-2">
                <HandOutIcon size={20} className="text-gray-500 shrink-0" />
                <span>{requirement.have}</span>
              </div>
              <div className="flex gap-2">
                <HandInIcon size={20} className="text-gray-500 shrink-0" />
                <span>{requirement.want}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <TagIcon size={20} className="text-gray-500 shrink-0" />
            <div className="flex">
              <span>قیمت: {numberSeparator(requirement.price)}</span>
              <TomanIcon size={20} className="text-gray-300" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default SwapCard
