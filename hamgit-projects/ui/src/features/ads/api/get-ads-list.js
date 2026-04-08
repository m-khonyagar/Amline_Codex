import { useInfiniteQuery } from '@tanstack/react-query'
import { apiGetAdsList } from '@/data/api/ad'

const useGetAds = ({ limit = 30, filters = {} }, options = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== false)
  )

  return useInfiniteQuery({
    queryKey: ['ads', filteredParams],

    initialPageParam: {
      offset: 0,
    },

    queryFn: async ({ pageParam }) => apiGetAdsList({ ...pageParam, ...filteredParams, limit }),

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

export default useGetAds
