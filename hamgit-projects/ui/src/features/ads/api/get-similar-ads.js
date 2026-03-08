import { useQuery } from '@tanstack/react-query'
import { apiGetSimilarAds } from '@/data/api/ad'

const useGetSimilarAds = (adId, options = {}) => {
  return useQuery({
    queryKey: ['similar-ads'].concat(Number(adId)),
    queryFn: () => apiGetSimilarAds(adId),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetSimilarAds
