import { useQuery } from '@tanstack/react-query'
import { apiGetPaymentHistory } from '@/data/api/contract'

/**
 * get contract by id query
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPaymentHistory = (id, options = {}) => {
  return useQuery({
    queryKey: ['payment-history'],
    queryFn: () => apiGetPaymentHistory(id),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetPaymentHistory
