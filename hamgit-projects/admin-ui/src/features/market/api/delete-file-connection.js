import { apiDeleteFileConnection } from '@/data/api/market'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * delete file connection
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useDeleteFileConnection = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiDeleteFileConnection,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-connections'] })
      options.onSuccess?.()
    },
  })
}
