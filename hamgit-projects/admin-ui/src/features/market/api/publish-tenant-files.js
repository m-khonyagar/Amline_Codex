import { apiPublishTenantFile } from '@/data/api/market'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const usePublishTenantFile = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, title }) => apiPublishTenantFile(id, { title }),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-file', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['tenant-files-list'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}
