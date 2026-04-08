import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGetPromoCodes } from '@/data/api/promo-codes'

/**
 * Hook for fetching promo codes list
 * @param {Object} params - Query parameters
 * @param {import('@tanstack/react-query').UseQueryOptions} options - Query options
 * @returns {import('@tanstack/react-query').UseQueryResult} Query object
 */
export const useGetPromoCodes = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['promo-codes', params],
    queryFn: () => apiGetPromoCodes(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    ...options,
  })
}
