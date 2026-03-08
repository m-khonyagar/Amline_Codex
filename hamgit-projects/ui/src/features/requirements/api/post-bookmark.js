import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPostBookmark } from '@/data/api/user'
import { bookmarksQueryKey } from './get-bookmark'
import { getAllSwapsQueryKey } from './get-all-swap'

/**
 * post bookmark
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePostBookmark = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPostBookmark(data),

    ...options,

    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: bookmarksQueryKey })

      queryClient.removeQueries({ queryKey: getAllSwapsQueryKey })

      options.onSuccess?.(res)
    },
  })
}
export default usePostBookmark
