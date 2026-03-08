import { apiGetPRContracts } from '@/data/api/prcontract'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * generate pr contracts query
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractsQuery = (params = {}, options = {}) => {
  return {
    queryKey: ['pr-contracts', params],
    queryFn: () => apiGetPRContracts(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    ...options,
  }
}

/**
 * get pr contracts
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContracts = (params = {}, options = {}) => {
  return useQuery(generateGetPRContractsQuery(params, options))
}

export { useGetPRContracts, generateGetPRContractsQuery }
