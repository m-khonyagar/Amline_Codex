import { apiRequest } from '@/data/services'
import { useQuery } from '@tanstack/react-query'

/**
 * get all base clause
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetAllBaseClauses = (options = {}) => {
  return useQuery({
    queryKey: ['clauses-list'],
    queryFn: () => apiRequest.get(`/admin/contracts/base-clauses`),
    select: (data) => data.data,
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
  })
}

export default useGetAllBaseClauses
