import { apiAcceptExchange, apiRejectExchange } from '@/data/api/requirement'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * accept an exchange
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useAcceptExchange = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiAcceptExchange,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['exchange', variables] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * reject an exchange
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useRejectExchange = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiRejectExchange,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['exchange', variables] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export { useAcceptExchange, useRejectExchange }
