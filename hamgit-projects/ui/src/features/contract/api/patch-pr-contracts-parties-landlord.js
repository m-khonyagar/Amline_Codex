import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiEditPrContractsPartiesLandlord } from '@/data/api/contract'
import { generateGetContractStatusQueryKey } from './get-contract-status'
import { generateGetPrContractPartiesLandlordQueryKey } from './get-pr-contracts-parties-landlord'
import { currentUserQueryKey } from '../../auth/api/get-current-user'

/**
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPrContractsPartiesLandlord = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiEditPrContractsPartiesLandlord(contractId, data),

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateGetPrContractPartiesLandlordQueryKey(contractId), res)
      queryClient.invalidateQueries({ queryKey: generateGetContractStatusQueryKey(contractId) })
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
      options.onSuccess?.(res)
    },
  })
}

export default usePatchPrContractsPartiesLandlord
