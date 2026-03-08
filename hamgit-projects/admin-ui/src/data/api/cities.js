import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services/index.js'

const citiesQueryKey = ['cities']

/**
 * get cities query
 * @param {object} param0
 * @param {number} param0.title‍
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetCities = ({ title } = {}, options = {}) => {
  return useQuery({
    queryKey: citiesQueryKey.concat({ title }),
    queryFn: () => apiRequest.get(`provinces/cities`, { title }),
    select: (res) =>
      (res.data || []).map((c) => ({ ...c, value: c.id, label: `${c.province} - ${c.name}` })),
    ...options,
  })
}

const useGetCityDetail = (city_id, options = {}) => {
  return useQuery({
    queryKey: ['cities', city_id],
    queryFn: () => apiRequest.get(`provinces/cities/${city_id}`),
    ...options,
  })
}

export { useGetCities, useGetCityDetail }
