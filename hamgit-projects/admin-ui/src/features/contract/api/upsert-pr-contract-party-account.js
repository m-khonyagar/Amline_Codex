import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiUpsertPRContractPartyAccount } from '@/data/api/prcontract'
import { generateGetPRContractPartiesQuery } from './get-pr-contract-parties'

/**
 * upsert pr contract party bank account mutation
 * @param {number} contractId
 * @param {number} partyId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpsertPRContractPartyAccount = (contractId, partyId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiUpsertPRContractPartyAccount(contractId, partyId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPartiesQuery(contractId).queryKey,
      })
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useUpsertPRContractPartyAccount
