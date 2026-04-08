import { apiPostContractDescriptions } from '@/data/api/prcontract'
import { useMutation } from '@tanstack/react-query'

/**
 * send pr contract descriptions
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendPRContractDescriptions = (options = {}) => {
  return useMutation({
    mutationFn: apiPostContractDescriptions,
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}
