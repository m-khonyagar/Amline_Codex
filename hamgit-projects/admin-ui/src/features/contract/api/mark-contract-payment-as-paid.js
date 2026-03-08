import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiMarkContractPaymentAsPaid } from '@/data/api/prcontract'
import { generateGetPRContractPaymentsQuery } from './get-pr-contract-payments'
import { generateGetPRContractCommissionsQuery } from './get-pr-contract-commissions'
import { generateGetPRContractStatusQuery } from './get-pr-contract-status'

/**
 * Mark contract payment as paid mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useMarkContractPaymentAsPaid = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentId) => apiMarkContractPaymentAsPaid(contractId, paymentId),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPaymentsQuery(contractId).queryKey,
      })

      queryClient.invalidateQueries({
        queryKey: generateGetPRContractCommissionsQuery(contractId).queryKey,
      })

      queryClient.invalidateQueries({
        queryKey: generateGetPRContractStatusQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useMarkContractPaymentAsPaid
