import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { HeaderNavigation, useAppContext } from '@/features/app'
import { AdPropertyTypeTranslation } from '@/data/enums/ad_property_type_enums'
import useGetAds from '../api/get-ads-list'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import AdCardSkeleton from '../components/AdCardSkeleton'
import AdCard from '../components/AdCard'
import InfiniteButton from '@/components/InfiniteButton'
import AdsFilter from '../components/AdsFilter'
import { propertyAdCategoryTranslation } from '../constants'
import { LocationBold2Icon } from '@/components/icons'

const LIMIT = 10

export default function AdListPage() {
  const router = useRouter()
  const { defaultCities, setIsOpen } = useAppContext()
  const { query } = router
  const adType = useMemo(() => query.type?.toLocaleUpperCase(), [query])
  const adCat = useMemo(() => query.cat?.toLocaleUpperCase(), [query])

  const pageTitle = `آگهی ${AdPropertyTypeTranslation[adType] || ''} ${propertyAdCategoryTranslation[adCat] || ''}`

  const adsQuery = useGetAds(
    {
      limit: LIMIT,
      filters: { ...query, type: adType, category: adCat, user_city_ids: defaultCities?.cities },
    },
    { enabled: router.isReady, staleTime: Infinity }
  )

  const ads = useMemo(
    () => (adsQuery.data?.pages || []).flatMap((page) => page?.data || []),
    [adsQuery.data]
  )

  useEffect(() => {
    if (router.isReady) {
      adsQuery.refetch()
    }
  }, [adsQuery, router.isReady])

  return (
    <>
      <HeaderNavigation title={pageTitle}>
        <button type="button" onClick={() => setIsOpen(true)} className="flex fa ml-4">
          {defaultCities?.cities.length === 1 && defaultCities.city_name}
          {defaultCities?.cities.length > 1 && `${defaultCities.cities.length} شهر`}
          <LocationBold2Icon />
        </button>
      </HeaderNavigation>

      <div className="flex-grow p-4 flex flex-col gap-5">
        <AdsFilter />

        <div className="flex flex-col gap-5">
          <LoadingAndRetry query={adsQuery} loadingComponent={AdCardSkeleton}>
            {!adsQuery.isLoading && ads.length === 0 && (
              <div className="flex justify-center items-center mt-40">
                <span className="text-rust-600 text-lg">آگهی ای وجود ندارد</span>
              </div>
            )}

            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}

            <InfiniteButton
              onLoad={() => adsQuery.fetchNextPage()}
              disabled={!adsQuery.hasNextPage}
              loading={adsQuery.isFetchingNextPage}
            />
          </LoadingAndRetry>
        </div>
      </div>
    </>
  )
}
