import { useMutation } from '@tanstack/react-query'
import { apiConfirmCode } from '@/data/api/auth'

/**
 * login confirm otp mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useConfirmCode = (options = {}) => {
  return useMutation({
    mutationFn: apiConfirmCode,
    select: (res) => res.data,
    ...options,
  })
}

export default useConfirmCode
