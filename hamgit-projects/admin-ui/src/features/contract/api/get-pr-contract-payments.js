import { apiGetPRContractPayments } from '@/data/api/prcontract'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get PR contract payments query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractPaymentsQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', 'payments', contractId],
    queryFn: () => apiGetPRContractPayments(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract payments
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContractPayments = (contractId, options = {}) => {
  return useQuery(generateGetPRContractPaymentsQuery(contractId, options))
}

export { useGetPRContractPayments, generateGetPRContractPaymentsQuery }
