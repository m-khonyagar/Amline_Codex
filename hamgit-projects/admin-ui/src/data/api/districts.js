import { useQuery, useMutation } from '@tanstack/react-query'
import { apiCreateDistrict, apiDeleteDistrict, apiUpdateDistrict } from './city'
import { apiRequest } from '../services'

/**
 * get district query
 * @param cityId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetDistrict = (cityId, options = {}) => {
  return useQuery({
    queryKey: ['district', cityId],
    queryFn: () => apiRequest.get(`/provinces/cities/${cityId}/districts`),
    select: (res) => (Array.isArray(res.data) ? res.data : Object.values(res.data)),
    ...options,
    _optimisticResults: 'optimistic',
  })
}

export function useCreateDistrict(cityId, options = {}) {
  return useMutation({
    mutationFn: (data) => apiCreateDistrict(cityId, data),
    ...options,
  })
}

export function useUpdateDistrict(options = {}) {
  return useMutation({
    mutationFn: ({ districtId, data }) => apiUpdateDistrict(districtId, data),
    ...options,
  })
}

export function useDeleteDistrict(options = {}) {
  return useMutation({
    mutationFn: (districtId) => apiDeleteDistrict(districtId),
    ...options,
  })
}

export default useGetDistrict
