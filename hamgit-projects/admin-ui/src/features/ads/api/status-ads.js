import { apiAcceptAd, apiDeArchiveAd, apiRejectAd } from '@/data/api/ads'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * accept an adv
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useAcceptAd = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiAcceptAd,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['ad', variables] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * reject an adv
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useRejectAd = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiRejectAd,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['ad', variables] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * deArchive an adv
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeArchiveAd = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiDeArchiveAd,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['ad', variables] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export { useAcceptAd, useRejectAd, useDeArchiveAd }
