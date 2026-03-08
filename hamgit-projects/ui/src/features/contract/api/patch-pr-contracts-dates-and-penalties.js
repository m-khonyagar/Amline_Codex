import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiEditPrContractsDatesAndPenalties } from '@/data/api/contract'
import { generateGetContractPaymentsQueryKey } from './get-contract-payments'
import { generateGetContractQueryKey } from '@/features/contract'

/**
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPrContractsDatesAndPenalties = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiEditPrContractsDatesAndPenalties(contractId, data),

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateGetContractQueryKey(contractId), res)
      queryClient.invalidateQueries({ queryKey: generateGetContractPaymentsQueryKey(contractId) })

      options.onSuccess?.(res)
    },
  })
}

export default usePatchPrContractsDatesAndPenalties
