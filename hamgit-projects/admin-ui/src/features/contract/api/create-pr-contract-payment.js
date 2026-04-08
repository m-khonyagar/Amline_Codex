import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiCreatePRContractPayment } from '@/data/api/prcontract'
import { generateGetPRContractPaymentsQuery } from './get-pr-contract-payments'
import { generateGetPRContractSummaryPaymentsQuery } from './get-pr-contract-summary-payments'

/**
 * create pr contract payment mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreatePRContractPayment = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiCreatePRContractPayment(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPaymentsQuery(contractId).queryKey,
        refetchType: 'all',
      })
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractSummaryPaymentsQuery(contractId).queryKey,
      })
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useCreatePRContractPayment
