import { apiRequest } from '../services'

export function apiBankGetaway(data) {
  return apiRequest.post(`/financials/bank/gateway`, data)
}
