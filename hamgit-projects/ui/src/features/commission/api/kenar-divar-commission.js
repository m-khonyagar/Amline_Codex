import { useQuery } from '@tanstack/react-query'
import { apiGetDivarRentalCommission } from '@/data/api/commission'

/**
 * get divar rental commission query
 * @param {string} token
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useDivarRentalCommission = (token, options = {}) => {
  return useQuery({
    queryKey: ['divar-rental-commission', token],
    queryFn: () => apiGetDivarRentalCommission(token),
    select: (res) => res.data,
    enabled: !!token,
    ...options,
  })
}
export default useDivarRentalCommission
