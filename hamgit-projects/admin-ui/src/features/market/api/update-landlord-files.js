import { apiUpdateLandlordFiles } from '@/data/api/market'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * update a landlord file
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useUpdateLandlordFiles = (id, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiUpdateLandlordFiles(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['landlord-file', id] })
      queryClient.invalidateQueries({
        queryKey: ['all-history-file', id],
        type: 'all',
      })
      queryClient.invalidateQueries({ queryKey: ['history-file', id], type: 'all' })
      options.onSuccess?.(data, variables, context)
    },
  })
}
