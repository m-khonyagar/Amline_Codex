import { useMemo, useState } from 'react'
import { useCopy } from '@/hooks/use-copy'
import usePostBookmark from '../api/post-bookmark'
import useDeleteBookmark from '../api/delete-bookmark'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { BookmarkBoldIcon, BookmarkIcon, ShareIcon } from '@/components/icons'
import { AdTypeEnums } from '@/data/enums/ad_type_enums'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'

const adsLink = {
  [AdTypeEnums.WANTED_AD]: `${publicRuntimeConfig.BASE_URL}/requirements/swaps/{id}`,
  [AdTypeEnums.SWAP_AD]: `${publicRuntimeConfig.BASE_URL}/requirements/swaps/{id}`,
  [AdTypeEnums.AD]: `${publicRuntimeConfig.BASE_URL}/ads/{type}/{cat}/{id}`,
}

export default function BookmarkAndShare({
  adType,
  adId,
  isSaved = false,
  adPropertyType,
  adCategory,
}) {
  const { copy } = useCopy()

  const [saved, setSaved] = useState(isSaved)
  const postBookmarkQuery = usePostBookmark()
  const deleteBookmarkQuery = useDeleteBookmark(adId)
  const loading = useMemo(
    () => postBookmarkQuery.isPending || deleteBookmarkQuery.isPending,
    [postBookmarkQuery.isPending, deleteBookmarkQuery.isPending]
  )

  const handleBookMarkPost = () => {
    if (loading) return
    setSaved(true)
    postBookmarkQuery.mutate(
      {
        ad_id: adId,
        ad_type: adType,
      },
      {
        onSuccess: () => {
          setSaved(true)
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      }
    )
  }
  const handleDeleteBookMark = () => {
    if (loading) return
    setSaved(false)
    deleteBookmarkQuery.mutate(null, {
      onSuccess: () => {
        setSaved(false)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }
  const handleSharePost = () => {
    let target = adsLink[adType].replace('{id}', adId)

    if (adType === AdTypeEnums.AD) {
      target = target.replace('{type}', adPropertyType.toLowerCase())
      target = target.replace('{cat}', adCategory.toLowerCase())
    }

    if (navigator.share) {
      navigator.share({ url: target })
    } else {
      copy(target)
      toast.success('لینک آگهی کپی شد')
    }
  }

  if (!adId) {
    return null
  }

  return (
    <>
      <ShareIcon className="text-sm text-gray-300 cursor-pointer" onClick={handleSharePost} />
      {saved ? (
        <BookmarkBoldIcon className="text-primary cursor-pointer" onClick={handleDeleteBookMark} />
      ) : (
        <BookmarkIcon
          className="text-sm text-gray-300 cursor-pointer"
          onClick={handleBookMarkPost}
        />
      )}
    </>
  )
}
