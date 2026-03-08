import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useGetSimilarAds from '../api/get-similar-ads'
import AdCarousel from './AdCarousel'

export default function SimilarAds({ adId }) {
  const [isInView, setIsInView] = useState(false)
  const query = useGetSimilarAds(adId, { enabled: isInView && !!adId })
  const ads = useMemo(
    () =>
      (query?.data || []).map((i) => {
        return {
          ...i,
          property: i.property || {}, // todo: remove this line after 'property' added to response
        }
      }),
    [query?.data]
  )

  const { ref, inView } = useInView()
  useEffect(() => {
    if (inView && !isInView) {
      setIsInView(true)
    }
  }, [inView, isInView])

  if (query.isSuccess && ads.length === 0) {
    return ''
  }

  return (
    <div ref={ref}>
      <div className="text-lg font-medium px-6 mb-3">آگهی‌های مشابه</div>
      <AdCarousel query={query} ads={ads} />
    </div>
  )
}
