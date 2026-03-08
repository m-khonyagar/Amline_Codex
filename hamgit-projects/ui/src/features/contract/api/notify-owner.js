import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiNotifyOwner } from '@/data/api/contract'
import { generateGetContractStatusQueryKey } from './get-contract-status'

/**
 * notify contract owner
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useNotifyOwner = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiNotifyOwner(contractId),

    ...options,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: generateGetContractStatusQueryKey(contractId) })

      options.onSuccess?.(res)
    },
  })
}

export default useNotifyOwner
