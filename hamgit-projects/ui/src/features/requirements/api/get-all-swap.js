import { useInfiniteQuery } from '@tanstack/react-query'
import { apiGetAllSwaps } from '@/data/api/requirement'

const getAllSwapsQueryKey = ['swaps']

/**
 * get swaps
 * @param {object} param0
 * @param {number} param0.limit
 * @param {import('axios').AxiosRequestConfig} config
 * @param {import('@tanstack/react-query').UseInfiniteQueryOptions} options
 * @returns {import('@tanstack/react-query').UseInfiniteQueryResult}
 */
const useGetAllSwaps = ({ limit = 30 }, options = {}) => {
  return useInfiniteQuery({
    queryKey: getAllSwapsQueryKey,

    initialPageParam: {
      offset: 0,
    },

    queryFn: async ({ pageParam }) => apiGetAllSwaps({ ...pageParam, limit }),

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

export default useGetAllSwaps

export { getAllSwapsQueryKey }
