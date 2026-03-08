import { apiRequest } from '../services'

export function apiGetUserCustomInvoices(params) {
  return apiRequest.get(`/admin/custom-invoices/users`, { params })
}

export function apiCreateCustomPaymentLint(data) {
  return apiRequest.post(`/admin/custom_payment_link`, data)
}
