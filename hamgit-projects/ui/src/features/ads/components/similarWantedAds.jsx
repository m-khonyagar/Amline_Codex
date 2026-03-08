import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useGetSimilarWantedAds from '../api/get-similar-wanted-ads'
import AdWantedCarousel from '../../requirements/components/AdWantedCarousel'

export default function SimilarWantedAds({ adId }) {
  const [isInView, setIsInView] = useState(false)
  const query = useGetSimilarWantedAds(adId, { enabled: isInView && !!adId })
  const ads = useMemo(() => query?.data || [], [query?.data])

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
      <div className="text-lg font-medium px-6 mb-3">نیازمندی‌های مشابه</div>
      <AdWantedCarousel query={query} ads={ads} />
    </div>
  )
}
