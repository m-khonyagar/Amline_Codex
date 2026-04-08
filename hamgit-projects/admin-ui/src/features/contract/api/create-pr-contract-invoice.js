import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiCreatePRContractInvoice } from '@/data/api/prcontract'
import { generateGetPRContractPaymentsQuery } from './get-pr-contract-payments'

/**
 * create pr contract payment mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useCreatePRContractInvoice = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiCreatePRContractInvoice(contractId),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPaymentsQuery(contractId).queryKey,
      })
      options?.onSuccess?.(res, variables, context)
    },
  })
}
