import { useQuery } from '@tanstack/react-query'
import { apiGetSwap } from '@/data/api/requirement'

const generateGetSwapQueryKey = (id) => {
  return ['swap'].concat(Number(id))
}

/**
 * get swap by id
 * @param {number | string} id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetSwap = (id, options = {}) => {
  return useQuery({
    queryKey: generateGetSwapQueryKey(id),
    queryFn: () => apiGetSwap(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetSwap

export { generateGetSwapQueryKey }
