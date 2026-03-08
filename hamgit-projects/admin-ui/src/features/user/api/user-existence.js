import { apiGetUserExistence } from '@/data/api/user'
import { useQuery } from '@tanstack/react-query'

/**
 * generate users query
 * @param {object} mobile
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetUserExistence = (mobile, options = {}) => {
  const regex = /^(09\d{9}|9\d{9})$/

  let isValidMobile = false
  if (regex.test(mobile)) isValidMobile = true

  return {
    queryKey: ['user-existence', mobile],
    queryFn: () => apiGetUserExistence(mobile),
    select: (res) => res.data,
    enabled: isValidMobile && options.enabled,
  }
}

/**
 * get users
 * @param {string} mobile
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetUserExistence = (mobile, options = {}) => {
  return useQuery(generateGetUserExistence(mobile, options))
}

export { useGetUserExistence, generateGetUserExistence }
