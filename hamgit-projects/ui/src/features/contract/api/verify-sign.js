import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiVerifySign } from '@/data/api/signature'
import { generateGetContractStatusQueryKey } from './get-contract-status'

/**
 * verify sign code mutation
 * @param contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useVerifyCode = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiVerifySign(contractId, data),
    ...options,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: generateGetContractStatusQueryKey(contractId) })

      options.onSuccess?.(res)
    },
  })
}

export default useVerifyCode
