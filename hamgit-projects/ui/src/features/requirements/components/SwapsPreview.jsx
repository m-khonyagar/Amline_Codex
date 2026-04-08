import Image from 'next/image'
import { useState } from 'react'
import { formatDistance } from 'date-fns-jalali'
import profileImg from '@/assets/images/profile.svg'
import { HandInIcon, HandOutIcon, TagIcon, TomanIcon } from '@/components/icons'
import { numberSeparator } from '@/utils/number'
import { BottomCTA } from '@/features/app'
import RequirementContactModal from '../../../components/ui/Modal/RequirementContactModal'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import AdsReport from './AdsReport'
import { AdCategoryEnums } from '@/data/enums/ad_category_enums'
import { AdTypeEnums } from '@/data/enums/ad_type_enums'
import BookmarkAndShare from './BookmarkAndShare'

function SwapsPreview({ requirement, children, defaultNickName }) {
  const [isShowContactModal, setIsShowContactModal] = useState(false)

  const handleChat = () => {
    toast.success('به زودی')
  }

  return (
    <div className="p-7 fa">
      <div className="border-b pb-3.5">
        <div className="flex justify-start gap-3 items-center mb-3">
          <Image alt={requirement?.nick_name} src={profileImg.src} width={32} height={32} />
          <div className="ml-auto text-gray-900">{defaultNickName || requirement?.nick_name}</div>

          {requirement.accepted_at && (
            <p className="text-gray-300 text-xs">
              {formatDistance(new Date(requirement.accepted_at), new Date(), { addSuffix: true })}
            </p>
          )}

          <BookmarkAndShare
            adType={AdTypeEnums.SWAP_AD}
            adId={requirement.id}
            isSaved={requirement.is_saved}
          />
        </div>

        <h3 className="font-bold text-gray-900">{requirement.title}</h3>
      </div>

      <div className="border-b py-3.5">
        <div className="flex items-center mb-3">
          <HandOutIcon size={24} className="text-gray-300 ml-2" />
          <span className="font-medium">چی دارم؟</span>
        </div>
        <p>{requirement.have}</p>
      </div>

      <div className="border-b py-3.5">
        <div className="flex items-center mb-3">
          <HandInIcon size={24} className="text-gray-300 ml-2" />
          <span className="font-medium">چی میخوام؟</span>
        </div>
        <p>{requirement.want}</p>
      </div>

      <div className="py-3.5 flex items-center">
        <TagIcon size={24} className="text-gray-500 ml-2" />
        <span className="ml-auto">قیمت</span>
        <span>{numberSeparator(requirement.price)}</span>
        <TomanIcon size={24} className="text-gray-300" />
      </div>

      {requirement?.id && (
        <div className="border-t py-3.5">
          <AdsReport adId={requirement?.id} adCategory={AdCategoryEnums.SWAP_AD} />
        </div>
      )}

      <BottomCTA>
        {children || (
          <div className="flex gap-2 px-2">
            <Button className="w-full" onClick={handleChat}>
              چت
            </Button>
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

export default SwapsPreview
