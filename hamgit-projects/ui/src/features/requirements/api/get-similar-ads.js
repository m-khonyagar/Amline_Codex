import { useQuery } from '@tanstack/react-query'
import { apiGetSimilarAds } from '@/data/api/requirement'

const useGetSimilarAds = (wantedId, options = {}) => {
  return useQuery({
    queryKey: ['similar-ads-'].concat(`wanted-id-${Number(wantedId)}`),
    queryFn: () => apiGetSimilarAds(wantedId),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetSimilarAds
