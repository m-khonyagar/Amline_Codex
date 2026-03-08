import { apiCreateFileConnection } from '@/data/api/market'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * create file connection
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useCreateFileConnection = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiCreateFileConnection,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-connections'] })
      options.onSuccess?.()
    },
  })
}
