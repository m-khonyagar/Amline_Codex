import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPatchPRContractProperty } from '@/data/api/prcontract'
import { generateGetPRContractPropertyQuery } from './get-pr-contract-property'

/**
 * patch pr contract property mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPRContractProperty = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPatchPRContractProperty(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.setQueryData(generateGetPRContractPropertyQuery(contractId).queryKey, res)
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default usePatchPRContractProperty
