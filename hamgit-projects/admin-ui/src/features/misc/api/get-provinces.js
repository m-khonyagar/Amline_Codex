import { useQuery } from '@tanstack/react-query'
import { apiGetProvinces } from '@/data/api/city'

const provincesQueryKey = ['provinces']

/**
 * get provinces query
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetProvinces = (options = {}) => {
  return useQuery({
    queryKey: provincesQueryKey,
    queryFn: apiGetProvinces,
    select: (res) => res.data,
    ...options,
  })
}

export default useGetProvinces
