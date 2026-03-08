import { useMutation } from '@tanstack/react-query'
import { apiPostSaleCommission } from '@/data/api/commission'

/**
 * post bookmark
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useSaleCommission = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiPostSaleCommission(data),
    select: (res) => res.data,
    ...options,
  })
}
export default useSaleCommission
