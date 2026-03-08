import { apiGetPRContractSummaryPayments } from '@/data/api/prcontract'
import { useQuery } from '@tanstack/react-query'

/**
 * generate get PR contract summary payments query
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetPRContractSummaryPaymentsQuery = (contractId, options = {}) => {
  return {
    queryKey: ['pr-contract', 'summary-payments', contractId],
    queryFn: () => apiGetPRContractSummaryPayments(contractId),
    select: (res) => res.data,
    ...options,
  }
}

/**
 * get PR contract summary payments
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPRContractSummaryPayments = (contractId, options = {}) => {
  return useQuery(generateGetPRContractSummaryPaymentsQuery(contractId, options))
}

export { useGetPRContractSummaryPayments, generateGetPRContractSummaryPaymentsQuery }
