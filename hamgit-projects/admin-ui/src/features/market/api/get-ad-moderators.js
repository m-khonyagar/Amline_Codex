import { apiGetAdModerators } from '@/data/api/market'
import { useQuery } from '@tanstack/react-query'

/**
 * get ad moderators
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetAdModerators = (options = {}) => {
  return useQuery({
    queryKey: ['ad-moderators'],
    queryFn: apiGetAdModerators,
    select: (res) => res.data,
    ...options,
  })
}
