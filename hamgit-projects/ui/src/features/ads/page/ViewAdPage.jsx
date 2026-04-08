import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useAuthContext } from '@/features/auth'
import { handleErrorOnSubmit } from '@/utils/error'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import AdPreview from '../components/AdPreview'
import useDeleteAd from '../api/delete-ad'
import useGetAd from '../api/get-ad'
import { adTypePaths } from '../constants'
import BookmarkAndShare from '../../requirements/components/BookmarkAndShare'
import { AdTypeEnums } from '@/data/enums/ad_type_enums'
import SimilarAds from '../components/SimilarAds'
import SimilarWantedAds from '../components/similarWantedAds'
import { ChevronRightIcon } from '@/components/icons'
import useBack from '@/hooks/use-back'
import { cn } from '@/utils/dom'
import SEO from '@/components/SEO'

function ViewAdPage() {
  const router = useRouter()
  const { goBack } = useBack()
  const { adId } = router.query
  const { currentUser } = useAuthContext()
  const adQuery = useGetAd(adId, { enabled: router.isReady })
  const ad = useMemo(() => adQuery.data, [adQuery.data])

  const isEditable = useMemo(
    () => currentUser?.id === adQuery?.data?.user_id,
    [currentUser, adQuery?.data]
  )

  const deleteAdMutation = useDeleteAd()
  const handleDelete = () => {
    deleteAdMutation.mutate(adId, {
      onSuccess: () => {
        router.replace('/profile/my-ads')
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }
  const handleEdit = () => {
    router.push(`/ads/edit/${adTypePaths[ad?.type]}/${adId}`)
  }

  return (
    <>
      <SEO title={ad?.title} noIndex />

      <div className="relative">
        <div
          className={cn(
            'flex items-center gap-2 z-10 w-full p-3 pb-5',
            ad ? 'absolute bg-gradient-to-b from-black/60 to-transparent text-gray-300' : ''
          )}
        >
          <button
            aria-label="goBack"
            type="button"
            className="ml-auto"
            onClick={() => goBack(null, 1)}
          >
            <ChevronRightIcon />
          </button>
          {ad && (
            <BookmarkAndShare
              adType={AdTypeEnums.AD}
              adId={ad.id}
              isSaved={ad.is_saved}
              adPropertyType={ad.type}
              adCategory={ad.category}
            />
          )}
        </div>

        <LoadingAndRetry query={adQuery} loadingClassName="p-6">
          {ad && (
            <AdPreview ad={ad}>
              {isEditable && (
                <div className="flex gap-2 px-2">
                  <Button
                    className="w-full"
                    onClick={handleEdit}
                    disabled={deleteAdMutation.isPending}
                  >
                    ویرایش
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDelete}
                    disabled={deleteAdMutation.isPending}
                  >
                    حذف
                  </Button>
                </div>
              )}
            </AdPreview>
          )}
        </LoadingAndRetry>
        {ad && (
          <div className="flex flex-col gap-6 -mt-10 mb-20">
            <SimilarAds adId={adId} />
            <SimilarWantedAds adId={adId} />
          </div>
        )}
      </div>
    </>
  )
}

export default ViewAdPage
