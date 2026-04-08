import { useMutation } from '@tanstack/react-query'
import { apiBankGetaway } from '@/data/api/bank-gateway'

/**
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useBankGateway = (options = {}) => {
  return useMutation({
    mutationFn: apiBankGetaway,
    ...options,
  })
}

export default useBankGateway
