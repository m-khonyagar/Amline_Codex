import { apiPublishLandlordFile } from '@/data/api/market'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const usePublishLandlordFile = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, title }) => apiPublishLandlordFile(id, { title }),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['landlord-file', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['landlord-files-list'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}
