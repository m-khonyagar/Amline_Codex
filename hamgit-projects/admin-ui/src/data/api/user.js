import { useMutation, useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services'

export function apiGetCurrentUser() {
  return apiRequest.get('/users/me')
}

export function apiGetUsers(params) {
  return apiRequest.get('/admin/users', { params })
}

export function apiGetUserInfo(userId) {
  return apiRequest.get(`admin/users/${userId}`)
}

export function apiGetUserAccessToken(userId) {
  return apiRequest.post(`/admin/users/${userId}/access-token`)
}

export function apiUpsertUser(data) {
  return apiRequest.put('/admin/users/create-or-update', data)
}

export function apiGetUserExistence(mobile) {
  return apiRequest.get(`/admin/user-existence/${mobile}`)
}

export function apiVerifyUser(data) {
  return apiRequest.post('/admin/users/verify-information', data)
}

export function apiSendUserCallDetails(data) {
  return apiRequest.post('/users/user-calls', data)
}

export function apiGetUserCalls(userId) {
  return apiRequest.get(`/users/user-calls/${userId}`)
}

export function apiGetUserTexts(userId) {
  return apiRequest.get(`/users/user-texts/${userId}`)
}

export function apiGetUserFileCalls(userId) {
  return apiRequest.get(`/users/file-calls/${userId}`)
}

export function apiGetUserFileTexts(userId) {
  return apiRequest.get(`/users/file-texts/${userId}`)
}

export function apiSendUserText(data) {
  return apiRequest.post('/users/user-texts', data)
}

export const currentUserQueryKey = ['current-user']

/**
 * get current user query
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: () => apiRequest.get('/users/me'),
    select: (res) => res.data,
    ...options,
  })
}

/**
 * api for revoke current user token
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useLogout = (options = {}) => {
  return useMutation({
    mutationFn: () => apiRequest.post('/auth/logout'),
    ...options,
  })
}

export const useGetSingleUserInfo = (user_id, options = {}) => {
  return useQuery({
    queryKey: ['user-info'],
    queryFn: () => apiRequest.get(`admin/users/${user_id}`),
    ...options,
  })
}

export const useLoginAsUser = (userId, options = {}) => {
  return useMutation({
    mutationFn: () => apiRequest.post(`/admin/users/${userId}/access-token`),
    ...options,
  })
}

export const useCreateOrUpdateUser = (options = {}) => {
  return useMutation({
    mutationFn: (data) => {
      return apiRequest.put(`/admin/contracts/new/user`, data)
    },
    ...options,
    onSuccess: (res) => {
      options?.onSuccess?.(res)
    },
    onError: (e) => {
      options?.onError?.(e)
    },
  })
}
