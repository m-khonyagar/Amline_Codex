import {
  apiGetUserCalls,
  apiGetUserFileCalls,
  apiGetUserFileTexts,
  apiGetUserTexts,
  apiSendUserCallDetails,
} from '@/data/api/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * send call details
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendCallDetails = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiSendUserCallDetails,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['user-calls', variables.user_id] })
      queryClient.invalidateQueries({ queryKey: ['user-list'], type: 'all' })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * get user calls
 * @param {number} userId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetUserCalls = (userId, options = {}) => {
  const { enabled = true, ...rest } = options
  return useQuery({
    queryKey: ['user-calls', userId],
    queryFn: () => apiGetUserCalls(userId),
    select: (res) => res.data,
    enabled: Boolean(userId) && enabled,
    ...rest,
  })
}

/**
 * get user texts
 * @param {number} userId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetUserTexts = (userId, options = {}) => {
  const { enabled = true, ...rest } = options
  return useQuery({
    queryKey: ['user-texts', userId],
    queryFn: () => apiGetUserTexts(userId),
    select: (res) => res.data,
    enabled: Boolean(userId) && enabled,
    ...rest,
  })
}

/**
 * get user related file calls
 * @param {number} userId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetUserFileCalls = (userId, options = {}) => {
  const { enabled = true, ...rest } = options
  return useQuery({
    queryKey: ['user-file-calls', userId],
    queryFn: () => apiGetUserFileCalls(userId),
    select: (res) => res.data,
    enabled: Boolean(userId) && enabled,
    ...rest,
  })
}

/**
 * get user related file texts
 * @param {number} userId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetUserFileTexts = (userId, options = {}) => {
  const { enabled = true, ...rest } = options
  return useQuery({
    queryKey: ['user-file-texts', userId],
    queryFn: () => apiGetUserFileTexts(userId),
    select: (res) => res.data,
    enabled: Boolean(userId) && enabled,
    ...rest,
  })
}
