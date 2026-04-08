import { apiCreateExchange, apiUpdateExchange } from '@/data/api/requirement'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * create a exchange
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateExchange = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiCreateExchange,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['exchange', data.data?.id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * update a exchange
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdateExchange = (id, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiUpdateExchange(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['exchange', id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export { useCreateExchange, useUpdateExchange }
