import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGetAdsVisitRequests } from '@/data/api/ads'

/**
 * get ads visit requests
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetAdsVisitRequests = (params, options = {}) => {
  return useQuery({
    queryKey: ['ads-visit-requests-list', params],
    queryFn: () => apiGetAdsVisitRequests(params),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    ...options,
  })
}

export { useGetAdsVisitRequests }
