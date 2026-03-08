import { useMutation } from '@tanstack/react-query'
import { apiAdminLogout } from '@/data/api/auth'

/**
 * login mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useAdminLogout = (options = {}) => {
  return useMutation({
    mutationFn: apiAdminLogout,
    ...options,
  })
}

export default useAdminLogout
