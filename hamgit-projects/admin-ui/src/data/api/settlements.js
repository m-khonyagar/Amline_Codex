import { useMutation, useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/data/services'

export function apiGetSettlementRequests(params) {
  return apiRequest.get(`/admin/settlements/users`, { params })
}

export const useGetSettlements = (params, options = {}) => {
  return useQuery({
    queryKey: ['settlements-users'].concat({ ...params }),
    queryFn: () => apiRequest.get('/admin/settlements/users', { params }),
    select: (res) => res.data,
    ...options,
  })
}

export const useUpdateSettlements = (options = {}) => {
  return useMutation({
    mutationFn: (body) => apiRequest.patch('/admin/settlements', body),
    ...options,
  })
}
