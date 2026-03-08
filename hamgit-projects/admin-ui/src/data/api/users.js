import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services/index.js'

const useGetUsers = (params, options = {}) => {
  return useQuery({
    queryKey: ['user-list'].concat({ ...params }),
    queryFn: () => apiRequest.get(`/admin/users`, { params }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    ...options,
  })
}

export { useGetUsers }
