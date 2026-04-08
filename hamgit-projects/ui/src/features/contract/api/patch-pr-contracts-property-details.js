import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiEditPrContractsPropertyDetails } from '@/data/api/contract'
import { generateGetPrContractPropertyQueryKey } from './get-pr-contract-property'

/**
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPrContractsPropertyDetails = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiEditPrContractsPropertyDetails(contractId, data),

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateGetPrContractPropertyQueryKey(contractId), res)
      options.onSuccess?.(res)
    },
  })
}

export default usePatchPrContractsPropertyDetails
