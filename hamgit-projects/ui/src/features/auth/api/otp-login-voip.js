import { useMutation } from '@tanstack/react-query'
import { apiOTPLoginVoip } from '@/data/api/auth'

/**
 * send OTP login mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useOTPLoginVoip = (options = {}) => {
  return useMutation({
    mutationFn: apiOTPLoginVoip,
    ...options,
  })
}

export default useOTPLoginVoip
