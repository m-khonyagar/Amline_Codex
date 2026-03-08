import { apiRequest } from '../services'

export function apiSignContract(contractId) {
  return apiRequest.post(`/pr-contracts/${contractId}/parties/otp-sign/send`)
}
export function apiSignContractVoip(contractId) {
  return apiRequest.post(`/pr-contracts/${contractId}/parties/voip-otp-sign/called`)
}

export function apiVerifySign(contractId, data) {
  return apiRequest.post(`/pr-contracts/${contractId}/parties/otp-sign/verify`, data)
}
