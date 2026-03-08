import { apiGetPRContractParties } from '@/data/api/prcontract'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get PR contract parties query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractPartiesQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', 'parties', contractId],
    queryFn: () => apiGetPRContractParties(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract parties
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContractParties = (contractId, options = {}) => {
  return useQuery(generateGetPRContractPartiesQuery(contractId, options))
}

export { useGetPRContractParties, generateGetPRContractPartiesQuery }
