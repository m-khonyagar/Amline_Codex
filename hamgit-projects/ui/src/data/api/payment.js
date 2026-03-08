import { apiRequest } from '@/data/services'

export function apiGetUserPayments(params) {
  return apiRequest.get(`/users/payments`, {
    params,
    paramsSerializer: { indexes: null },
  })
}
export function apiGetContractPayments(contractId, params) {
  return apiRequest.get(`/pr-contracts/${contractId}/payments`, { params })
}

export function apiCreatePaymentCash(contractId, data) {
  return apiRequest.post(`/pr-contracts/${contractId}/payments/cash`, data)
}
export function apiCreatePaymentCheque(contractId, data) {
  return apiRequest.post(`/pr-contracts/${contractId}/payments/cheque`, data)
}
export function apiCreateRentPaymentMonthlyRent(contractId, data) {
  return apiRequest.post(`/pr-contracts/${contractId}/payments/cash/monthly-rent`, data)
}

export function apiPatchPaymentCash(contractId, paymentId, data) {
  return apiRequest.put(`/pr-contracts/${contractId}/payments/cash/${paymentId}/`, data)
}
export function apiPatchPaymentCheque(contractId, paymentId, data) {
  return apiRequest.put(`/pr-contracts/${contractId}/payments/cheque/${paymentId}`, data)
}

export function apiDeletePrContractPayment(contractId, paymentId) {
  return apiRequest.delete(`/pr-contracts/${contractId}/payments/${paymentId}`)
}
export function apiDeletePrContractAllPayments(contractId, paymentType) {
  return apiRequest.delete(`/pr-contracts/${contractId}/payments`, {
    data: { payment_type: paymentType },
  })
}

export function apiCompletePayment(contractId, data) {
  return apiRequest.post(`/pr-contracts/${contractId}/payments/finalize`, data)
}
