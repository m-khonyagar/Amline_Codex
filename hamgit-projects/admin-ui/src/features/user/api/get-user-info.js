import { apiGetUserInfo } from '@/data/api/user'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get user info query
 * @param {number} userId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetUserInfoQuery = (userId, options = {}) => {
  return {
    queryKey: ['user', userId],
    queryFn: () => apiGetUserInfo(userId),
    select: (res) => res.data,
    enabled: !!userId,
    ...options,
  }
}

/**
 * get user info
 * @param {number} userId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetUserInfo = (userId, options = {}) => {
  return useQuery(generateGetUserInfoQuery(userId, options))
}

export { useGetUserInfo, generateGetUserInfoQuery }
