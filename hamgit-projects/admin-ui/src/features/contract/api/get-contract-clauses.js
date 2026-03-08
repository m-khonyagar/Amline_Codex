import { apiGetContractClauses } from '@/data/api/prcontract'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get contract clauses query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetContractClausesQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', 'clauses', contractId],
    queryFn: () => apiGetContractClauses(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract clauses
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetContractClauses = (contractId, options = {}) => {
  return useQuery(generateGetContractClausesQuery(contractId, options))
}

export { useGetContractClauses, generateGetContractClausesQuery }
