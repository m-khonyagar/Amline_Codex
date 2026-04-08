import { apiGetExchanges } from '@/data/api/requirement'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * get exchanges
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetExchanges = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['exchange-list', params],
    queryFn: () => apiGetExchanges(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    ...options,
  })
}
