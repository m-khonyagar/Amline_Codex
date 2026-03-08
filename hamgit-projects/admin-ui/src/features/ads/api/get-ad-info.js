import { apiGetAdInfo } from '@/data/api/ads'
import { useQuery } from '@tanstack/react-query'

/**
 * get ad info
 * @param {number} id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetAdInfo = (id, options = {}) => {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => apiGetAdInfo(id),
    select: (res) => res.data,
    enabled: !!id,
    ...options,
  })
}

export { useGetAdInfo }
