import { apiRequest } from '../services'
import { useMutation } from '@tanstack/react-query'

export function apiAdminLogin(data) {
  return apiRequest.post('/admin/login', data)
}

export function apiAdminLogout(data) {
  return apiRequest.post('/admin/logout', data)
}

/**
 * send OTP login mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useOTPLogin = (options = {}) => {
  return useMutation({
    mutationFn: ({ mobile }) => apiRequest.post('/admin/otp/send', { mobile }),
    ...options,
  })
}
/**
 * send OTP login mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */

const useOTPLoginVoip = (options = {}) => {
  return useMutation({
    mutationFn: ({ mobile }) => apiRequest.post('/admin/voip-otp', { mobile }),
    ...options,
  })
}

/**
 * login confirm otp mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useConfirmCode = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post('/admin/otp/verify', data),
    ...options,
  })
}

const useLogin = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post('/admin/login', data),
    ...options,
  })
}

const apiRefreshToken = async (refreshToken) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/token/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!response.ok) throw new Error(`Refresh token failed with status ${response.status}`)

  return response.json()
}

export { useOTPLogin, useConfirmCode, useLogin, apiRefreshToken, useOTPLoginVoip }
