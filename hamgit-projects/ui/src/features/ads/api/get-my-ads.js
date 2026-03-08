import { useQuery } from '@tanstack/react-query'
import { apiGetMyAds } from '@/data/api/ad'

const useGetMyAds = (options = {}) => {
  return useQuery({
    queryKey: ['my-ads'],
    queryFn: apiGetMyAds,
    ...options,
  })
}

export default useGetMyAds
