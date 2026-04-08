import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mySwapsQueryKey } from './get-my-swaps'
import { apiPatchSwap } from '@/data/api/requirement'
import { generateGetSwapQueryKey } from './get-swap'

const useEditSwap = (id, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPatchSwap(id, data),
    ...options,
    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: mySwapsQueryKey })
      queryClient.removeQueries({ queryKey: generateGetSwapQueryKey(id) })

      options.onSuccess?.(res)
    },
  })
}

export default useEditSwap
