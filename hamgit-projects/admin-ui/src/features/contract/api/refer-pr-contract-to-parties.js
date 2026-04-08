import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiReferPRContractToParties } from '@/data/api/prcontract'
import { generateGetPRContractInfoQuery } from './get-pr-contract-info'

/**
 * refer pr contract to parties mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useReferPRContractToParties = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiReferPRContractToParties(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractInfoQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useReferPRContractToParties
