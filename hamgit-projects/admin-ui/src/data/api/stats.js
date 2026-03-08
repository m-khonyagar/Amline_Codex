import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services/index.js'

const useGetSingleUserStats = (params, options = {}) => {
  return useQuery({
    queryKey: ['user-stats', params.user_id],
    queryFn: () => apiRequest.get(`/v1/admin/stats/user`, { params }),
    ...options,
  })
}

const useGetAllUsersStats = () => {
  return useQuery({
    queryKey: ['all-stats'],
    queryFn: () => apiRequest.get(`/v1/admin/stats/public`),
  })
}

export { useGetSingleUserStats, useGetAllUsersStats }
