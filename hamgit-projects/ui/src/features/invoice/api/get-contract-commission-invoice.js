import { useQuery } from '@tanstack/react-query'
import { apiGetContractCommissionInvoice } from '@/data/api/invoice'

const contractCommissionInvoiceQueryKey = ['contract', 'commission']

const generateGetContractCommissionInvoiceQueryKey = (id) => {
  return contractCommissionInvoiceQueryKey.concat(Number(id))
}

/**
 * get contract commission invoice by id query
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetContractCommissionInvoice = (contractId, options = {}) => {
  return useQuery({
    queryKey: generateGetContractCommissionInvoiceQueryKey(contractId),
    queryFn: () => apiGetContractCommissionInvoice(contractId),
    select: (res) => res.data,
    ...options,
  })
}

export default useGetContractCommissionInvoice
export { generateGetContractCommissionInvoiceQueryKey }
