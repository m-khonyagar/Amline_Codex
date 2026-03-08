import { useMutation } from '@tanstack/react-query'
import { apiRealtorStartContract } from '@/data/api/contract'

/**
 * realtor start contract mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useRealtorStartContract = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRealtorStartContract(data),
    ...options,
  })
}

export default useRealtorStartContract
