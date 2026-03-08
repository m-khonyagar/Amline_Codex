import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiEditPrContractsPropertyFacilities } from '@/data/api/contract'
import { generateGetPrContractPropertyQueryKey } from './get-pr-contract-property'

/**
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPrContractsPropertyFacilities = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiEditPrContractsPropertyFacilities(contractId, data),
    ...options,
    onSuccess: (res) => {
      queryClient.setQueryData(generateGetPrContractPropertyQueryKey(contractId), res)
      options.onSuccess?.(res)
    },
  })
}

export default usePatchPrContractsPropertyFacilities
