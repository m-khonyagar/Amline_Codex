import { apiRequest } from '@/data/services'

export function apiStartContract(data) {
  return apiRequest.post('/contracts/start', data)
}

export function apiGetPrContractStatus(id) {
  return apiRequest.get(`/pr-contracts/${id}/status`)
}

export function apiGetContract(id) {
  return apiRequest.get(`/pr-contracts/${id}`)
}

export function apiGetContracts() {
  return apiRequest.get(`/contracts/list`)
}

export function apiPatchContract(id, data) {
  return apiRequest.patch(`/v1/users/contract/${id}`, data)
}

export function apiNotifyOwner(contractId) {
  return apiRequest.post(`/pr-contracts/${contractId}/tenant-approve`)
}

export function apiGetPaymentHistory(id) {
  return apiRequest.get(`/v1/users/contracts/${id}/payments?page=1&count=10`)
}

export function apiExportContract(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/pdf`)
}

export function apiGetContractClauses(contractId) {
  return apiRequest.get(`/contracts/${contractId}/clauses`)
}

export function apiCreateContractClauses(contractId, data) {
  return apiRequest.post(`/contracts/${contractId}/clauses`, data)
}

export function apiEditContractClauses(contractId, clauseId, data) {
  return apiRequest.put(`/contracts/${contractId}/clauses/${clauseId}`, data)
}

export function apiDeleteContractClauses(contractId, clauseId) {
  return apiRequest.delete(`/contracts/${contractId}/clauses/${clauseId}`)
}

export function apiRejectContract(contractId) {
  return apiRequest.delete(`/pr-contracts/${contractId}/reject`)
}

export function apiRevisionRequestContract(contractId) {
  return apiRequest.patch(`/pr-contracts/${contractId}/edit-request`)
}

// Parties
export function apiGetPrContractsParties(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/parties`)
}

export function apiGetPrContractsCounterParties(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/counter-party`)
}

export function apiCreatePrContractsParties(contractId, data) {
  return apiRequest.post(`/pr-contracts/${contractId}/counter-party`, data)
}

export function apiEditPrContractsPartiesLandlord(contractId, data) {
  return apiRequest.put(`/pr-contracts/${contractId}/parties/landlord`, data)
}

export function apiEditPrContractsPartiesTenant(contractId, data) {
  return apiRequest.put(`/pr-contracts/${contractId}/parties/tenant`, data)
}

export function apiGetPrContractsPartiesLandlord(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/parties/landlord`)
}

export function apiGetPrContractsPartiesTenant(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/parties/tenant`)
}

// Property
export function apiGetPrContractProperty(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/property`)
}

export function apiEditPrContractsPropertyFacilities(contractId, data) {
  return apiRequest.patch(`/pr-contracts/${contractId}/property/facilities`, data)
}

export function apiEditPrContractsPropertyDetails(contractId, data) {
  return apiRequest.patch(`/pr-contracts/${contractId}/property/details`, data)
}

export function apiEditPrContractsPropertySpecifications(contractId, data) {
  return apiRequest.patch(`/pr-contracts/${contractId}/property/specifications`, data)
}

// Date and payments
export function apiEditPrContractsDatesAndPenalties(contractId, data) {
  return apiRequest.patch(`/pr-contracts/${contractId}/dates-and-penalties`, data)
}

export function apiEditPrContractsDeposit(contractId, data) {
  return apiRequest.patch(`/pr-contracts/${contractId}/deposit`, data)
}

export function apiEditPrContractsMonthlyRent(contractId, data) {
  return apiRequest.patch(`/pr-contracts/${contractId}/monthly-rent`, data)
}

export function apiGetPrContractPreview(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/preview`)
}

export function apiGetPrContractsInquire(contractId, params) {
  return apiRequest.get(`/pr-contracts/${contractId}/inquire`, { params })
}

export function apiClaimedToHavePaid(contractId, paymentId) {
  return apiRequest.patch(
    `/pr-contracts/${contractId}/payments/${paymentId}/payer-claimed-to-have-paid`
  )
}

export function apiPayeeConfirmedReceipt(contractId, paymentId) {
  return apiRequest.patch(
    `/pr-contracts/${contractId}/payments/${paymentId}/payee-confirmed-receipt`
  )
}

export function apiPayeeDeniedReceipt(contractId, paymentId) {
  return apiRequest.patch(`/pr-contracts/${contractId}/payments/${paymentId}/payee-denied-receipt`)
}
