import { apiAcceptAdVisitRequest, apiRejectAdVisitRequest } from '@/data/api/ads'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * accept an ad visit request
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useAcceptAdVisitRequests = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiAcceptAdVisitRequest,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['ads-visit-requests-list'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * reject an ad visit request
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useRejectAdVisitRequests = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiRejectAdVisitRequest,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['ads-visit-requests-list'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export { useAcceptAdVisitRequests, useRejectAdVisitRequests }
