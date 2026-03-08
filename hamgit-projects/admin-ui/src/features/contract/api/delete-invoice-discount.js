import { useMutation } from '@tanstack/react-query'
import { apiDeleteInvoiceDiscountCode } from '@/data/api/prcontract'

/**
 * delete applied invoice discount item
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useDeleteInvoiceDiscount = (options = {}) => {
  return useMutation({
    mutationFn: (invoiceItemId) => apiDeleteInvoiceDiscountCode(invoiceItemId),
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}
