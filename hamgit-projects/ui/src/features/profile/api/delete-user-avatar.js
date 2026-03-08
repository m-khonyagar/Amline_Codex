import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDeleteAvatar } from '@/data/api/user'

/**
 * delete user avatar
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeleteUserAvatar = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiDeleteAvatar,
    ...options,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      options.onSuccess?.(res)
    },
  })
}

export default useDeleteUserAvatar
