import { apiDeleteAd } from '@/data/api/ads'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * delete an adv
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeleteAd = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiDeleteAd,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['ads-list'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export { useDeleteAd }
