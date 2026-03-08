import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiUpdatePRContractPayment } from '@/data/api/prcontract'
import { generateGetPRContractPaymentsQuery } from './get-pr-contract-payments'
import { generateGetPRContractSummaryPaymentsQuery } from './get-pr-contract-summary-payments'

/**
 * update pr contract payment mutation
 * @param {number} contractId
 * @param {number} paymentId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdatePRContractPayment = (contractId, paymentId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiUpdatePRContractPayment(contractId, paymentId, data),
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

export default useUpdatePRContractPayment
