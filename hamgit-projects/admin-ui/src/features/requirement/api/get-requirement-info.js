import { apiGetRequirementInfo } from '@/data/api/requirement'
import { useQuery } from '@tanstack/react-query'

/**
 * get requirement info
 * @param {number} id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetRequirementInfo = (id, options = {}) => {
  return useQuery({
    queryKey: ['requirement', id],
    queryFn: () => apiGetRequirementInfo(id),
    select: (res) => res.data,
    enabled: !!id,
    ...options,
  })
}

export { useGetRequirementInfo }
