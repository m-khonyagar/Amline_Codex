import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPostPRContractColor } from '@/data/api/prcontract'
import { generateGetPRContractInfoQuery } from './get-pr-contract-info'
import { generateGetPRContractsQuery } from './get-pr-contracts'

/**
 * post pr contract color mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePostPRContractColor = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPostPRContractColor(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractInfoQuery(contractId).queryKey,
      })

      queryClient.invalidateQueries({ queryKey: generateGetPRContractsQuery().queryKey })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default usePostPRContractColor
