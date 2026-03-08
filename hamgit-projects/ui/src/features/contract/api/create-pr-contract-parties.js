import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiCreatePrContractsParties } from '@/data/api/contract'
import { generateGetContractStatusQueryKey } from './get-contract-status'
import { generateGetPrContractCounterPartiesQueryKey } from './get-pr-contracts-counter-parties'

/**
 * @param contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreatePrContractsParties = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiCreatePrContractsParties(contractId, data),

    ...options,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: generateGetContractStatusQueryKey(contractId) })
      queryClient.invalidateQueries({
        queryKey: generateGetPrContractCounterPartiesQueryKey(contractId),
      })

      options.onSuccess?.(res)
    },
  })
}

export default useCreatePrContractsParties
