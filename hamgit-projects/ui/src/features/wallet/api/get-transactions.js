import { useInfiniteQuery } from '@tanstack/react-query'
import { apiGetWalletTransactions } from '@/data/api/wallet'

const useGetWalletTransactions = (limit = 30, options = {}) => {
  return useInfiniteQuery({
    queryKey: ['financials-wallet-transactions'],

    initialPageParam: {
      offset: 0,
    },

    queryFn: ({ pageParam }) => apiGetWalletTransactions({ ...pageParam, limit }),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data?.data?.length === limit) {
        return {
          offset: allPages.reduce((prev, curr) => prev + curr.data.data.length, 0),
        }
      }

      return undefined
    },

    ...options,
  })
}

export default useGetWalletTransactions
