import { apiUpdateTenantFiles } from '@/data/api/market'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * update a tenant file
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useUpdateTenantFiles = (id, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiUpdateTenantFiles(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-file', id] })
      queryClient.invalidateQueries({
        queryKey: ['all-history-file', id],
        type: 'all',
      })
      queryClient.invalidateQueries({ queryKey: ['history-file', id], type: 'all' })
      options.onSuccess?.(data, variables, context)
    },
  })
}
