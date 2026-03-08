import { apiGetPRContractCommissions } from '@/data/api/prcontract'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get PR contract commissions query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractCommissionsQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', 'commissions', contractId],
    queryFn: () => apiGetPRContractCommissions(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract commissions
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContractCommissions = (contractId, options = {}) => {
  return useQuery(generateGetPRContractCommissionsQuery(contractId, options))
}

export { useGetPRContractCommissions, generateGetPRContractCommissionsQuery }
