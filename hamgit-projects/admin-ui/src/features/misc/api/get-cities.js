import { useQuery } from '@tanstack/react-query'
import { apiGetCities } from '@/data/api/city'

const citiesQueryKey = ['cities']

/**
 * get cities query
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetCities = (options = {}) => {
  return useQuery({
    queryKey: citiesQueryKey,
    queryFn: () => apiGetCities(),
    select: (res) =>
      (res.data || []).map((c) => ({ ...c, full_name: `${c.province} - ${c.name}` })),
    ...options,
  })
}

export default useGetCities
