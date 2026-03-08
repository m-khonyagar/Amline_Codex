import { apiGetPRContractInfo } from '@/data/api/prcontract'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get PR contract info query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractInfoQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', contractId],
    queryFn: () => apiGetPRContractInfo(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract info
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContractInfo = (contractId, options = {}) => {
  return useQuery(generateGetPRContractInfoQuery(contractId, options))
}

export { useGetPRContractInfo, generateGetPRContractInfoQuery }
