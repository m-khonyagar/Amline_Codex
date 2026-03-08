import { apiUpsertUser } from '@/data/api/user'
import { generateGetUserInfoQuery } from './get-user-info'
import { generateGetUsersQuery } from './get-users'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Upsert user mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpsertUser = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiUpsertUser,
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({ queryKey: generateGetUserInfoQuery(res.data.id).queryKey })
      queryClient.invalidateQueries({ queryKey: generateGetUsersQuery().queryKey, type: 'all' })
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useUpsertUser
