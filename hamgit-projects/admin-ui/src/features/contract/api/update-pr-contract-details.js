import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiUpdatePRContractDetails } from '@/data/api/prcontract'
import { generateGetPRContractInfoQuery } from './get-pr-contract-info'
import { generateGetPRContractPaymentsQuery } from './get-pr-contract-payments'
import { generateGetPRContractSummaryPaymentsQuery } from './get-pr-contract-summary-payments'

/**
 * update pr contract details mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdatePRContractDetails = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiUpdatePRContractDetails(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractInfoQuery(contractId).queryKey,
      })

      if (variables.deposit_amount || variables.rent_amount) {
        queryClient.invalidateQueries({
          queryKey: generateGetPRContractPaymentsQuery(contractId).queryKey,
        })

        queryClient.invalidateQueries({
          queryKey: generateGetPRContractSummaryPaymentsQuery(contractId).queryKey,
        })
      }
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useUpdatePRContractDetails
