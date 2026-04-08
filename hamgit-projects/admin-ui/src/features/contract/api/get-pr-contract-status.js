import { useQuery } from '@tanstack/react-query'
import { apiGetPRContractStatus } from '@/data/api/prcontract'

/**
 * generate get PR contract status query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractStatusQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', 'status', contractId],
    queryFn: () => apiGetPRContractStatus(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract status
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContractStatus = (contractId, options = {}) => {
  return useQuery(generateGetPRContractStatusQuery(contractId, options))
}

export { useGetPRContractStatus, generateGetPRContractStatusQuery }
