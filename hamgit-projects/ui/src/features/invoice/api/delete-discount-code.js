import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDeleteDiscountCode } from '@/data/api/invoice'
import { generateGetInvoiceQueryKey } from './get-invoice'

/**
 * Delete discount code from invoice
 * @param invoiceId invoice id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeleteDiscountCode = (invoiceId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiDeleteDiscountCode,
    ...options,
    onSuccess: (res) => {
      queryClient.invalidateQueries(generateGetInvoiceQueryKey(invoiceId))
      options.onSuccess?.(res)
    },
  })
}

export default useDeleteDiscountCode
