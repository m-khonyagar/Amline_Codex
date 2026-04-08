import { useQuery } from '@tanstack/react-query'
import { apiGetCurrentUser } from '@/data/api/user'
import { fullName } from '@/utils/dom'

/**
 * generate current user query
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateCurrentUserQuery = (options = {}) => {
  return {
    queryKey: ['current-user'],
    queryFn: apiGetCurrentUser,
    select: (res) => {
      return {
        ...res.data,
        name: fullName(res.data),
      }
    },
    ...options,
  }
}

/**
 * get current user
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useCurrentUser = (options = {}) => {
  return useQuery(generateCurrentUserQuery(options))
}

export { useCurrentUser, generateCurrentUserQuery }
