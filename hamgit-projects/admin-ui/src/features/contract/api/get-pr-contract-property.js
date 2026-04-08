import { apiGetPRContractProperty } from '@/data/api/prcontract'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get PR contract property query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractPropertyQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', 'property', contractId],
    queryFn: () => apiGetPRContractProperty(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract property
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContractProperty = (contractId, options = {}) => {
  return useQuery(generateGetPRContractPropertyQuery(contractId, options))
}

export { useGetPRContractProperty, generateGetPRContractPropertyQuery }
