import { apiDeleteRequirement } from '@/data/api/requirement'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * delete a requirement
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useDeleteRequirement = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiDeleteRequirement,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['requirement-list'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}
