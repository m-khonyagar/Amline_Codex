import { useMutation } from '@tanstack/react-query'
import { apiApplyInvoicePromoCode } from '@/data/api/prcontract'

/**
 * apply promo code on invoice
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useApplyInvoicePromo = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiApplyInvoicePromoCode(data),
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}
