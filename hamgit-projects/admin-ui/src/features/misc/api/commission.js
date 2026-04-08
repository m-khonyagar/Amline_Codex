import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/data/services'

/**
 * post bookmark
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useRentalCommission = (data, options = {}) => {
  return useQuery({
    queryKey: ['rent-commission', data],
    queryFn: () => apiRequest.post('/users/calculate/rent-commission', data),
    select: (res) => res.data,
    ...options,
  })
}
