import { apiDeleteExchange } from '@/data/api/requirement'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * delete a requirement
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useDeleteExchange = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiDeleteExchange,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['exchange-list'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}
