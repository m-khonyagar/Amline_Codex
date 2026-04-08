import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFinalizePRContractPayments } from '@/data/api/prcontract'
import { generateGetPRContractCommissionsQuery } from './get-pr-contract-commissions'
import { generateGetPRContractSummaryPaymentsQuery } from './get-pr-contract-summary-payments'

/**
 * finalize pr contract payments mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useFinalizePRContractPayment = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiFinalizePRContractPayments(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractCommissionsQuery(contractId).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractSummaryPaymentsQuery(contractId).queryKey,
      })
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useFinalizePRContractPayment
