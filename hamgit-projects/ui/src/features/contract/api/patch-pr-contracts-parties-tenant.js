import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiEditPrContractsPartiesTenant } from '@/data/api/contract'
import { generateGetContractStatusQueryKey } from './get-contract-status'
import { generateGetPrContractPartiesTenantQueryKey } from './get-pr-contracts-parties-tenant'
import { currentUserQueryKey } from '../../auth/api/get-current-user'

/**
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPrContractsPartiesTenant = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiEditPrContractsPartiesTenant(contractId, data),

    ...options,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPrContractPartiesTenantQueryKey(contractId),
      })
      queryClient.invalidateQueries({ queryKey: generateGetContractStatusQueryKey(contractId) })
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
      options.onSuccess?.(res)
    },
  })
}

export default usePatchPrContractsPartiesTenant
