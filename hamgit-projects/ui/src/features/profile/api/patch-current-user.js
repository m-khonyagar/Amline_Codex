import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPatchCurrentUser } from '@/data/api/user'
import { currentUserQueryKey } from '../../auth/api/get-current-user'

/**
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchCurrentUser = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiPatchCurrentUser,
    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(currentUserQueryKey, res)
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      options.onSuccess?.(res)
    },
  })
}

export default usePatchCurrentUser
