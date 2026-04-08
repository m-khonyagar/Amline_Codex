import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { HeaderNavigation } from '@/features/app'
import useGetMyAds from '../api/get-my-ads'
import AdCardSkeleton from '../components/AdCardSkeleton'
import AdCard from '../components/AdCard'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect'
import { PlusIcon } from '@/components/icons'

export default function MyAdsPage() {
  const myAdsQuery = useGetMyAds()
  const myAds = useMemo(() => myAdsQuery?.data?.data || [], [myAdsQuery?.data])

  const addRef = useRef()
  const [offsetLeft, setOffsetLeft] = useState(24)

  useIsomorphicEffect(() => {
    if (!addRef.current) return

    const mainEl = document.querySelector('#__main')
    setOffsetLeft(window.innerWidth - mainEl.offsetWidth - mainEl.offsetLeft + 24)
  }, [])

  return (
    <>
      <HeaderNavigation title="آگهی های من" />

      <div className="flex-grow p-6 flex flex-col gap-5">
        <LoadingAndRetry query={myAdsQuery} loadingComponent={AdCardSkeleton}>
          {!myAdsQuery.isLoading && myAds.length === 0 && (
            <div className="flex justify-center items-center mt-40">
              <span className="text-rust-600 text-lg">آگهی ای وجود ندارد</span>
            </div>
          )}

          {myAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} showStatus />
          ))}
        </LoadingAndRetry>
      </div>

      <Link
        ref={addRef}
        href="/ads/new"
        style={{ left: `${offsetLeft}px` }}
        className="fixed left-7 bottom-28 grid place-items-center size-14 bg-teal-600 text-white rounded-full z-[110]"
      >
        <PlusIcon size={28} />
      </Link>
    </>
  )
}
