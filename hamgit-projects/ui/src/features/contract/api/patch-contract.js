import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPatchContract } from '@/data/api/contract'
import { generateGetContractQueryKey } from '@/features/contract'

/**
 * update contract by id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchContract = (id, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPatchContract(id, data),

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateGetContractQueryKey(id), res)
      options.onSuccess?.(res)
    },
  })
}

export default usePatchContract
