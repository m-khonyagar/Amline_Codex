import { useMutation } from '@tanstack/react-query'
import { apiRequest } from '../services/index.js'

export const useCreateCustomPaymentLink = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post('/admin/custom_payment_link', data),
    ...options,
  })
}

export const useUsersCustomInvoices = (mobile, options = {}) => {
  return useMutation({
    mutationFn: (params) => apiRequest.get('/admin/custom-invoices/users', { params }),
    ...options,
    staleTime: Infinity,
  })
}
