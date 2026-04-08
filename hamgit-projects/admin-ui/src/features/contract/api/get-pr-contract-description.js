import { apiGetContractDescriptions } from '@/data/api/prcontract'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get PR contract descriptions query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractDescriptionsQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', 'descriptions', contractId],
    queryFn: () => apiGetContractDescriptions(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract descriptions
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContractDescriptions = (contractId, options = {}) => {
  return useQuery(generateGetPRContractDescriptionsQuery(contractId, options))
}

export { useGetPRContractDescriptions, generateGetPRContractDescriptionsQuery }
