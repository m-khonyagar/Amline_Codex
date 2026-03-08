import { useMutation } from '@tanstack/react-query'
import { apiCreateCustomPaymentLint } from '@/data/api/custom-invoices'

/**
 * create custom payment link mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateCustomPaymentLink = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiCreateCustomPaymentLint(data),
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useCreateCustomPaymentLink
