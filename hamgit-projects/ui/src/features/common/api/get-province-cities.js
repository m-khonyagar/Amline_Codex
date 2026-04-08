import { useQuery } from '@tanstack/react-query'
import { apiGetProvinceCities } from '@/data/api/city'

/**
 * get province-cities query
 * @param {number}  id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */

const useGetProvinceCities = (id, options = {}) => {
  return useQuery({
    queryKey: ['province-cities', id],
    queryFn: () => apiGetProvinceCities(id),
    select: (res) => res.data,
    ...options,
    _optimisticResults: 'optimistic',
  })
}

export default useGetProvinceCities
