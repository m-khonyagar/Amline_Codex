import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiSignPRContractParty } from '@/data/api/prcontract'
import { generateGetPRContractPartiesQuery } from './get-pr-contract-parties'

/**
 * sign pr contract party mutation
 * @param {number} contractId
 * @param {number} partyId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useSignPRContractParty = (contractId, partyId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiSignPRContractParty(contractId, partyId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPartiesQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useSignPRContractParty
