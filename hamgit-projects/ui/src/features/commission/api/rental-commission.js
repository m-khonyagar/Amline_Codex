import { useMutation } from '@tanstack/react-query'
import { apiPostRentalCommission } from '@/data/api/commission'

/**
 * post bookmark
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useRentalCommission = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiPostRentalCommission(data),
    select: (res) => res.data,
    ...options,
  })
}
export default useRentalCommission
