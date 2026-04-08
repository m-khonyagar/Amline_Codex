import { useMutation } from '@tanstack/react-query'
import { apiStartContract } from '@/data/api/contract'

/**
 * start contract mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useStartContract = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiStartContract(data),
    ...options,
  })
}

export default useStartContract
