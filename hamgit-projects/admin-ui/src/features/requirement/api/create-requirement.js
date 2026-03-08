import { apiCreateRequirement, apiUpdateRequirement } from '@/data/api/requirement'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * create a requirement
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateRequirement = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiCreateRequirement,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['requirement', data.data?.id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * update a requirement
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdateRequirement = (id, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiUpdateRequirement(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['requirement', id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export { useCreateRequirement, useUpdateRequirement }
