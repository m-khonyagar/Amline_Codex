import { apiGetUserCustomInvoices } from '@/data/api/custom-invoices'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * generate get user custom invoices query
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryOptions}
 */
const generateGetUserCustomInvoicesQuery = (params = {}, options = {}) => {
  return {
    queryKey: ['user-custom-invoices', params],
    queryFn: () => apiGetUserCustomInvoices(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    ...options,
  }
}

/**
 * get user custom invoices
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetUserCustomInvoices = (params = {}, options = {}) => {
  return useQuery(generateGetUserCustomInvoicesQuery(params, options))
}

export { useGetUserCustomInvoices, generateGetUserCustomInvoicesQuery }
