import { apiRequest } from '@/data/services'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * update a base clause
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdateBaseClauses = (baseClausesId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiRequest.put(`/admin/contracts/base-clauses/${baseClausesId}`, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['clauses-list'] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export default useUpdateBaseClauses
