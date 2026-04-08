import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiEditPrContractsDeposit } from '@/data/api/contract'
import { generateGetContractStatusQueryKey } from './get-contract-status'
import { generateGetContractQueryKey } from '@/features/contract'
import { useOptimisticUpdateContractPayments } from './get-contract-payments'

/**
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPrContractsDeposit = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  const updateContractPayments = useOptimisticUpdateContractPayments()

  return useMutation({
    mutationFn: (data) => apiEditPrContractsDeposit(contractId, data),

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateGetContractQueryKey(contractId), res)
      queryClient.invalidateQueries({ queryKey: generateGetContractStatusQueryKey(contractId) })
      updateContractPayments.update(null, contractId)

      options.onSuccess?.(res)
    },
  })
}

export default usePatchPrContractsDeposit
