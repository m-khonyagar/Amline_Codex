import { apiGetExistingMobile } from '@/data/api/market'
import { useQuery } from '@tanstack/react-query'

/**
 * get existing customer mobile
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetExistingMobile = (mobile, options = {}) => {
  return useQuery({
    queryKey: ['existing-mobile', mobile],
    queryFn: () => apiGetExistingMobile(mobile),
    select: (res) => res.data,
    ...options,
  })
}
