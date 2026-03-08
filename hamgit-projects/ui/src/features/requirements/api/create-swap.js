import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mySwapsQueryKey } from './get-my-swaps'
import { apiPostSwap } from '@/data/api/requirement'

const useCreateSwap = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPostSwap(data),
    ...options,
    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: mySwapsQueryKey })

      options.onSuccess?.(res)
    },
  })
}

export default useCreateSwap
