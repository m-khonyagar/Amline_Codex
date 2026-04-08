import { apiGetFileConnections } from '@/data/api/market'
import { useQuery } from '@tanstack/react-query'

/**
 * get file connections
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetFileConnections = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['file-connections', params],
    queryFn: () => apiGetFileConnections(params),
    select: (res) => res.data,
    enabled: !!params.landlord_file_id || !!params.tenant_file_id,
    ...options,
  })
}
