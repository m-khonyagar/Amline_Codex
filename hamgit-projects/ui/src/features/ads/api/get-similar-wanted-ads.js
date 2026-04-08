import { useQuery } from '@tanstack/react-query'
import { apiGetSimilarWantedAds } from '@/data/api/ad'

const useGetSimilarWantedAds = (adId, options = {}) => {
  return useQuery({
    queryKey: ['similar-wanted-ads'].concat(Number(adId)),
    queryFn: () => apiGetSimilarWantedAds(adId),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetSimilarWantedAds
