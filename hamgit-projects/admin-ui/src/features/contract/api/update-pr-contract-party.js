import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiUpdatePRContractParty } from '@/data/api/prcontract'
import { generateGetPRContractPartiesQuery } from './get-pr-contract-parties'

/**
 * update pr contract details mutation
 * @param {number} contractId
 * @param {number} partyId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdatePRContractParty = (contractId, partyId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiUpdatePRContractParty(contractId, partyId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPartiesQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useUpdatePRContractParty
