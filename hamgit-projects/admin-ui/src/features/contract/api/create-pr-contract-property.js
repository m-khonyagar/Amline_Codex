import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiCreatePRContractProperty } from '@/data/api/prcontract'
import { generateGetPRContractPropertyQuery } from './get-pr-contract-property'

/**
 * create pr contract property mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreatePRContractProperty = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiCreatePRContractProperty(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.setQueryData(generateGetPRContractPropertyQuery(contractId).queryKey, res)
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useCreatePRContractProperty
