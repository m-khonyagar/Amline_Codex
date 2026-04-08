import { useMutation } from '@tanstack/react-query'
import { apiOTPLogin } from '@/data/api/auth'

/**
 * send OTP login mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useOTPLogin = (options = {}) => {
  return useMutation({
    mutationFn: apiOTPLogin,
    ...options,
  })
}

export default useOTPLogin
