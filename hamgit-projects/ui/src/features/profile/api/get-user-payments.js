import { useInfiniteQuery } from '@tanstack/react-query'
import { apiGetUserPayments } from '@/data/api/payment'

const userPaymentsQueryKey = ['user-payments']

const generateGetUserPaymentsQueryKey = (paymentSide) => {
  return userPaymentsQueryKey.concat(paymentSide)
}

/**
 * get user payments
 * @param {object} param0
 * @param {string} param0.paymentSide PAYER, PAYEE
 * @param {number} param0.limit
 * @param {import('@tanstack/react-query').UseInfiniteQueryOptions} options
 * @returns {import('@tanstack/react-query').UseInfiniteQueryResult}
 */
const useGetUserPayments = ({ paymentSide, limit = 30 }, options = {}) => {
  return useInfiniteQuery({
    queryKey: generateGetUserPaymentsQueryKey(paymentSide),

    initialPageParam: {
      offset: 0,
    },

    queryFn: ({ pageParam }) =>
      apiGetUserPayments({ ...pageParam, payment_side: paymentSide, limit }),

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

export default useGetUserPayments
