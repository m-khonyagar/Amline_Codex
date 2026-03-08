import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDeletePRContractPayment } from '@/data/api/prcontract'
import { generateGetPRContractPaymentsQuery } from './get-pr-contract-payments'
import { generateGetPRContractSummaryPaymentsQuery } from './get-pr-contract-summary-payments'

/**
 * delete pr contract payment mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeletePRContractPayment = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentId) => apiDeletePRContractPayment(contractId, paymentId),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPaymentsQuery(contractId).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractSummaryPaymentsQuery(contractId).queryKey,
      })
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useDeletePRContractPayment
