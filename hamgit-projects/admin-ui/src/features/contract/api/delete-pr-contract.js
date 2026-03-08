import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDeletePRcontract } from '@/data/api/prcontract'
import { generateGetPRContractsQuery } from './get-pr-contracts'

/**
 * delete pr contract mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeletePRContract = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiDeletePRcontract(contractId),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractsQuery().queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useDeletePRContract
