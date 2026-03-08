import { useInfiniteQuery } from '@tanstack/react-query'
import { apiGetMySwaps } from '@/data/api/requirement'

const mySwapsQueryKey = ['my-swaps']

const useGetMySwaps = ({ limit = 30 }, options = {}) => {
  return useInfiniteQuery({
    queryKey: mySwapsQueryKey,

    initialPageParam: {
      offset: 0,
    },

    queryFn: ({ pageParam }) => apiGetMySwaps({ ...pageParam, limit }),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.length === limit) {
        return {
          offset: allPages.reduce((prev, curr) => prev + curr.data.length, 0),
        }
      }

      return undefined
    },

    ...options,
  })
}

export default useGetMySwaps

export { mySwapsQueryKey }
