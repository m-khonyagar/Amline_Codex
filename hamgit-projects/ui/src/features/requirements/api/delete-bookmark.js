import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDeleteBookmark } from '@/data/api/user'
import { bookmarksQueryKey } from './get-bookmark'
import { getAllSwapsQueryKey } from './get-all-swap'

/**
 * delete bookmark
 * @param adId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeleteBookmark = (adId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiDeleteBookmark(adId),

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(bookmarksQueryKey, (oldData) => {
        return oldData
          ? {
              data: oldData.data.filter((i) => i.ad_data.id !== adId),
            }
          : undefined
      })

      queryClient.removeQueries({ queryKey: getAllSwapsQueryKey })

      options.onSuccess?.(res)
    },
  })
}
export default useDeleteBookmark
