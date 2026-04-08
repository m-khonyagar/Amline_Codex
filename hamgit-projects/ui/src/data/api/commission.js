import { apiRequest } from '../services'

export function apiPostRentalCommission(data) {
  return apiRequest.post('/users/calculate/rent-commission', data)
}

export function apiPostSaleCommission(data) {
  return apiRequest.post('/users/calculate/sale-commission', data)
}

export function apiGetDivarRentalCommission(token) {
  return apiRequest.get(`/kenar-divar/commission-calculator/${token}`)
}
