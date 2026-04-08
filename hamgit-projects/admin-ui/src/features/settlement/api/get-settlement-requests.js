import { apiGetSettlementRequests } from '@/data/api/settlements'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * generate get settlement requests query
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetSettlementRequestsQuery = (params = {}, options = {}) => {
  return {
    queryKey: ['settlement-requests', params],
    queryFn: () => apiGetSettlementRequests(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    ...options,
  }
}

/**
 * get settlement requests
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetSettlementRequests = (params = {}, options = {}) => {
  return useQuery(generateGetSettlementRequestsQuery(params, options))
}

export { useGetSettlementRequests, generateGetSettlementRequestsQuery }
