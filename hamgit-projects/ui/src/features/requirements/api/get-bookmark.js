import { useQuery } from '@tanstack/react-query'
import { apiGetBookmarks } from '@/data/api/user'

const bookmarksQueryKey = ['bookmarks']

const useGetBookmarks = (options = {}) => {
  return useQuery({
    queryKey: bookmarksQueryKey,

    queryFn: apiGetBookmarks,

    ...options,
  })
}

export default useGetBookmarks

export { bookmarksQueryKey }
