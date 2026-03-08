import { useQuery } from '@tanstack/react-query'
import { apiGetRequirement } from '@/data/api/requirement'

const generateGetRequirementQueryKey = (id) => ['requirement', id]

/**
 * get requirement by id query
 * @param {number | string} id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetRequirement = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetRequirementQueryKey(id),
    queryFn: () => apiGetRequirement(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetRequirement

export { generateGetRequirementQueryKey }
