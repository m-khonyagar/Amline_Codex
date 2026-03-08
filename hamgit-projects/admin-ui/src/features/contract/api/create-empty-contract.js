import { useMutation } from '@tanstack/react-query'
import { apiCreateEmptyContract } from '@/data/api/contract'

/**
 * create empty contract by tracking code
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateEmptyContract = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiCreateEmptyContract(data),
    ...options,
  })
}

export default useCreateEmptyContract
