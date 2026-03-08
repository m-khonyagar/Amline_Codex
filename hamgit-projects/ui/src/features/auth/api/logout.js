import { useMutation } from '@tanstack/react-query'
import { apiLogout } from '@/data/api/auth'

/**
 * api for revoke current user token
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useLogout = (options = {}) => {
  return useMutation({
    mutationFn: apiLogout,
    ...options,
  })
}

export default useLogout
