import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiEditPrContractsPropertySpecifications } from '@/data/api/contract'
import { generateGetPrContractPropertyQueryKey } from './get-pr-contract-property'

/**
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPrContractsPropertySpecifications = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiEditPrContractsPropertySpecifications(contractId, data),

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateGetPrContractPropertyQueryKey(contractId), res)
      options.onSuccess?.(res)
    },
  })
}

export default usePatchPrContractsPropertySpecifications
