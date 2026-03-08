import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiCompletePayment } from '@/data/api/payment'
import { generateGetContractQueryKey } from '@/features/contract'

/**
 * @param {number|string} contractId contract id
 * @param {string} paymentType payment category Enum
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCompleteContractPayment = (contractId, paymentType, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiCompletePayment(contractId, { payment_type: paymentType }),

    ...options,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: generateGetContractQueryKey(contractId) })
      options.onSuccess?.(res)
    },
  })
}

export default useCompleteContractPayment
