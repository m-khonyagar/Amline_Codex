import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mySwapsQueryKey } from './get-my-swaps'
import { apiDeleteSwap } from '@/data/api/requirement'

const useDeleteSwap = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => apiDeleteSwap(id),
    ...options,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: mySwapsQueryKey })

      options.onSuccess?.(res)
    },
  })
}

export default useDeleteSwap
