import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiStartContract } from '@/data/api/contract'
import { myContractQueryKey } from './my-contracts'

/**
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateContract = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiStartContract,

    ...options,

    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: myContractQueryKey })

      options.onSuccess?.(res)
    },
  })
}

export default useCreateContract
