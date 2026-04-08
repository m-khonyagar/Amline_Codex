import { apiVerifyUser } from '@/data/api/user'
import { generateGetUserInfoQuery } from './get-user-info'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Verify user mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useVerifyUser = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiVerifyUser,
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetUserInfoQuery(res.data.id).queryKey,
      })
      options?.onSuccess?.(res, variables, context)
      console.log(res)
    },
  })
}

export default useVerifyUser
