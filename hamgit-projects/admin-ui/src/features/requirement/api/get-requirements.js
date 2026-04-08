import { apiGetRequirements } from '@/data/api/requirement'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * get requirements
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetRequirements = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['requirement-list', params],
    queryFn: () => apiGetRequirements(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    ...options,
  })
}
