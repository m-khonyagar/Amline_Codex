import { apiGetUsers } from '@/data/api/user'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * generate users query
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetUsersQuery = (params = {}, options = {}) => {
  return {
    queryKey: ['user-list', params],
    queryFn: () => apiGetUsers(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    ...options,
  }
}

/**
 * get users
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetUsers = (params = {}, options = {}) => {
  return useQuery(generateGetUsersQuery(params, options))
}

export { useGetUsers, generateGetUsersQuery }
