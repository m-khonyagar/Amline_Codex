import { apiGetExchangeInfo } from '@/data/api/requirement'
import { useQuery } from '@tanstack/react-query'

/**
 * get an exchange info
 * @param {number} id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetExchangeInfo = (id, options = {}) => {
  return useQuery({
    queryKey: ['exchange', id],
    queryFn: () => apiGetExchangeInfo(id),
    select: (res) => res.data,
    enabled: !!id,
    ...options,
  })
}

export { useGetExchangeInfo }
