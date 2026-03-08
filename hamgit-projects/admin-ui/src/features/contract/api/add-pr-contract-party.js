import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiAddPRContractParty } from '@/data/api/prcontract'
import { generateGetPRContractPartiesQuery } from './get-pr-contract-parties'

/**
 * add pr contract party mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useAddPRContractParty = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiAddPRContractParty(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPartiesQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useAddPRContractParty
