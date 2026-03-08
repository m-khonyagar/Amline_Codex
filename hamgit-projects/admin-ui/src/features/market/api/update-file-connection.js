import { apiUpdateFileConnection } from '@/data/api/market'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * update a file connection
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useUpdateFileConnection = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => apiUpdateFileConnection(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['file-connections'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}
