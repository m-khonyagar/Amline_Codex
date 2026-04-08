import { useQuery } from '@tanstack/react-query'
import { apiGetDistrict } from '@/data/api/city'

/**
 * get district query
 * @param {number}  id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */

const useGetDistrict = (id, options = {}) => {
  return useQuery({
    queryKey: ['district', id],
    queryFn: () => apiGetDistrict(id),
    select: (res) => (Array.isArray(res.data) ? res.data : Object.values(res.data)),
    ...options,
    _optimisticResults: 'optimistic',
  })
}

export default useGetDistrict
