import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services'

const allConfigQueryKey = ['config-all']

const useConfigAll = (options = {}) => {
  return useQuery({
    queryKey: allConfigQueryKey,
    queryFn: () => apiRequest.get('/v1/guest/config'),
    select: (res) => res.data,
    ...options,
  })
}

const useGetPropertyTypes = (options = {}) => {
  return useQuery({
    queryKey: allConfigQueryKey,
    queryFn: () => apiRequest.get('/v1/guest/config'),
    select: (res) =>
      res.data.property_type.map((item) => ({
        label: [item.title, item.type].filter((t) => !!t).join(' - '),
        value: `${item.id}`,
      })),
    ...options,
  })
}

export { useConfigAll, useGetPropertyTypes }
