import { apiPatchAd, apiPostAd } from '@/data/api/ads'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * create an adv
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateAd = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiPostAd,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['ad', data.data?.id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * update an adv
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdateAd = (id, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiPatchAd(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['ad', id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export { useCreateAd, useUpdateAd }
