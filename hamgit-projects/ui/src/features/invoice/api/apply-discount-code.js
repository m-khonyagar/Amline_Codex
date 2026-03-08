import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDiscountCode } from '@/data/api/invoice'
import { generateGetInvoiceQueryKey } from './get-invoice'

/**
 * Apply discount code to invoice
 * @param contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useApplyDiscountCode = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiDiscountCode(data),
    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateGetInvoiceQueryKey(res.data.id), res)
      options.onSuccess?.(res)
    },
  })
}

export default useApplyDiscountCode
