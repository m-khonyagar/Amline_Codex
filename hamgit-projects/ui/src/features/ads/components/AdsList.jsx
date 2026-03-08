import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/router'
import AdCarousel from './AdCarousel'
import { useAppContext } from '@/features/app'
import { ReadMoreIcon } from '@/components/icons'

export default function AdsList({ useQuery, limit = 10, adType, adCat, label, link }) {
  const { defaultCities } = useAppContext()
  const router = useRouter()
  const [isInView, setIsInView] = useState(false)

  const query = useQuery(
    { limit, filters: { type: adType, category: adCat, user_city_ids: defaultCities?.cities } },
    { enabled: isInView && router.isReady }
  )

  const ads = useMemo(
    () => (query?.data?.pages || []).flatMap((page) => page?.data || []),
    [query?.data]
  )

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && !isInView) setIsInView(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  if (query.isSuccess && ads.length === 0) return null

  return (
    <div className="mb-6">
      <div ref={ref}>
        <div className="flex mb-3 justify-between">
          <h3 className="text-lg px-7 py-1">{label}</h3>

          <Link href={link} className="bg-gray-200 text-lg px-3 py-1 rounded-r-lg">
            <ReadMoreIcon />
          </Link>
        </div>
        <AdCarousel query={query} ads={ads} />
      </div>
    </div>
  )
}
