import { apiRequest } from '../services'

export function apiGetContractCommissionInvoice(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/commission`)
}

export function apiGetInvoice(invoiceId) {
  return apiRequest.get(`/financials/invoices/${invoiceId}`)
}

export function apiGetPaymentInvoice(paymentId) {
  return apiRequest.get(`/v1/users/payments/${paymentId}/invoices`)
}

export function apiDiscountCode(data) {
  return apiRequest.post(`/financials/invoices/apply-promo`, data)
}

export function apiDeleteDiscountCode(invoiceItemId) {
  return apiRequest.delete(`/financials/invoices/items/${invoiceItemId}`)
}
