import { useQuery } from '@tanstack/react-query'
import { apiGetInvoice } from '@/data/api/invoice'

const contractCommissionInvoiceQueryKey = ['invoice']

const generateGetInvoiceQueryKey = (id) => {
  return contractCommissionInvoiceQueryKey.concat(Number(id))
}

/**
 * get invoice by id query
 * @param {number | string} invoiceId invoice id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetInvoice = (invoiceId, options = {}) => {
  return useQuery({
    queryKey: generateGetInvoiceQueryKey(invoiceId),
    queryFn: () => apiGetInvoice(invoiceId),
    select: (res) => res.data,
    ...options,
    enabled: !!invoiceId,
    staleTime: 0,
    refetchOnMount: true,
  })
}

export default useGetInvoice
export { generateGetInvoiceQueryKey }
