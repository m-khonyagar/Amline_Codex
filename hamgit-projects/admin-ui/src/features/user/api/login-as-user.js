import { useMutation } from '@tanstack/react-query'
import { apiGetUserAccessToken } from '@/data/api/user'

/**
 * login as user mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useLoginAsUser = (options = {}) => {
  return useMutation({
    mutationFn: apiGetUserAccessToken,
    ...options,
  })
}

export default useLoginAsUser
