import { useMutation } from '@tanstack/react-query'
import { apiRequest } from '../services'

export function apiGetWallets(params) {
  return apiRequest.get(`/admin/financials/wallets`, { params })
}

export function apiWalletManualCharge(data) {
  return apiRequest.post(`/admin/financials/wallets/manual-charge`, data)
}

export function apiWalletBulkManualCharge(data) {
  return apiRequest.post(`/admin/financials/wallets/bulk-manual-charge`, data)
}

const useWalletManualCharge = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post(`/financials/wallets/manual-charge`, data),
    ...options,
  })
}

export { useWalletManualCharge }
