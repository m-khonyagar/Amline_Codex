import { useQuery } from '@tanstack/react-query'
import { apiGetPaymentInvoice } from '@/data/api/invoice'

const contractCommissionInvoiceQueryKey = ['payment', 'invoice']

const generateGetPaymentInvoiceQueryKey = (id) => {
  return contractCommissionInvoiceQueryKey.concat(Number(id))
}

/**
 * get invoice by payment id query
 * @param {number} paymentId payment id
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetPaymentInvoice = (paymentId, options = {}) => {
  return useQuery({
    queryKey: generateGetPaymentInvoiceQueryKey(paymentId),
    queryFn: () => apiGetPaymentInvoice(paymentId),
    select: (res) => res.data,
    ...options,
    enabled: !!paymentId,
  })
}

export default useGetPaymentInvoice
export { generateGetPaymentInvoiceQueryKey }
