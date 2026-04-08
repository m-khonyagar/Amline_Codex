import { useMutation } from '@tanstack/react-query'
import { apiRequest } from '@/data/services'

export function registerRealtorApi(payload) {
  return apiRequest.post('/auth/realtor/register', payload)
}

/**
 * api for revoke current user token
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useRegisterRealtor(options = {}) {
  return useMutation({
    mutationFn: registerRealtorApi,
    ...options,
  })
}
