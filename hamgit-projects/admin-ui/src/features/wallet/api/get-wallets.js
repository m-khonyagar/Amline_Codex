import { apiGetWallets } from '@/data/api/wallet'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * generate wallet list query
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetWalletsQuery = (params = {}, options = {}) => {
  return {
    queryKey: ['wallet-list', params],
    queryFn: () => apiGetWallets(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    ...options,
  }
}

/**
 * get wallet list
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetWallets = (params = {}, options = {}) => {
  return useQuery(generateGetWalletsQuery(params, options))
}

export { useGetWallets, generateGetWalletsQuery }
