import { useQuery } from '@tanstack/react-query'
import { apiGetSimilarWantedAds } from '@/data/api/requirement'

const useGetSimilarWantedAds = (wantedId, options = {}) => {
  return useQuery({
    queryKey: ['similar-wanted-ads'].concat(`wanted-id-${Number(wantedId)}`),
    queryFn: () => apiGetSimilarWantedAds(wantedId),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetSimilarWantedAds
