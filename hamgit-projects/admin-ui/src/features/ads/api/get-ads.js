import { apiGetAds } from '@/data/api/ads'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * get ads
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetAds = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['ads-list', params],
    queryFn: () => apiGetAds(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    ...options,
  })
}
