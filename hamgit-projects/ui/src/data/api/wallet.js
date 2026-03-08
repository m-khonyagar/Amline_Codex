import { apiRequest } from '@/data/services'

export function apiGetWalletTransactions(params) {
  return apiRequest.get(`/financials/wallets/transactions`, { params })
}

export function apiGetWallet() {
  return apiRequest.get('/financials/wallets')
}

export function apiChargeWallet(params) {
  return apiRequest.post('/financials/wallets/charge', null, { params })
}

export function apiCreateWalletSettlements(body) {
  return apiRequest.post('/financials/wallets/settlements', body)
}

export function apiGetWalletSettlements() {
  return apiRequest.get('/financials/wallets/settlements')
}
