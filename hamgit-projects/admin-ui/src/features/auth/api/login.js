import { useMutation } from '@tanstack/react-query'
import { apiAdminLogin } from '@/data/api/auth'

/**
 * login mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useAdminLogin = (options = {}) => {
  return useMutation({
    mutationFn: apiAdminLogin,
    ...options,
  })
}

export default useAdminLogin
