import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../services'
import { getPaymentsQK } from './contract-payments'

export function apiGetPRContracts(params) {
  return apiRequest.get('/admin/pr-contracts/list', { params })
}

export function apiGetPRContractInfo(contractId) {
  return apiRequest.get(`/admin/pr-contracts/${contractId}`)
}

export function apiDeletePRcontract(contractId) {
  return apiRequest.delete(`/admin/pr-contracts/${contractId}`)
}

export function apiGetPRContractStatus(contractId) {
  return apiRequest.get(`/admin/pr-contracts/${contractId}/status`)
}

export function apiPatchPRContractStatus(contractId, data) {
  return apiRequest.patch(`/admin/pr-contracts/${contractId}/status`, data)
}

export function apiPatchPRContractTrackingCode(contractId, data) {
  return apiRequest.patch(`/admin/pr-contracts/${contractId}/tracking-code`, data)
}

export function apiPostPRContractColor(contractId, data) {
  return apiRequest.post(`/admin/pr-contracts/${contractId}/color`, data)
}

export function apiReferPRContractToParties(contractId) {
  return apiRequest.patch(`/admin/pr-contracts/${contractId}/refer-to-parties`)
}

export function apiUpdatePRContractDetails(contractId, data) {
  return apiRequest.patch(`/admin/pr-contracts/${contractId}/details`, data)
}

export function apiGetPRContractParties(contractId) {
  return apiRequest.get(`/admin/pr-contracts/${contractId}/parties`)
}

export function apiAddPRContractParty(contractId, data) {
  return apiRequest.post(`/admin/pr-contracts/${contractId}/parties`, data)
}

export function apiUpdatePRContractParty(contractId, partyId, data) {
  return apiRequest.put(`/admin/pr-contracts/${contractId}/parties/${partyId}`, data)
}

export function apiUpsertPRContractPartyAccount(contractId, partyId, data) {
  return apiRequest.put(`/admin/pr-contracts/${contractId}/parties/${partyId}/accounts`, data)
}

export function apiSendPRContractPartySignOTP(contractId, partyId) {
  return apiRequest.post(`/admin/pr-contracts/${contractId}/parties/${partyId}/otp-sign/send`)
}

export function apiGetPaymentLink(data) {
  return apiRequest.post('/financials/bank/gateway', data)
}

export function apiSendLinkViaSMS(data) {
  return apiRequest.post('/financials/bank/gateway/message-user', data)
}

export function apiApplyInvoicePromoCode(data) {
  return apiRequest.post('/financials/invoices/apply-promo', data)
}

export function apiDeleteInvoiceDiscountCode(invoiceItemId) {
  return apiRequest.delete(`/financials/invoices/items/${invoiceItemId}`)
}

export function apiConfirmPRContractPartySignOTP(contractId, partyId, data) {
  return apiRequest.post(
    `/admin/pr-contracts/${contractId}/parties/${partyId}/otp-sign/confirm`,
    data
  )
}

export function apiSignPRContractParty(contractId, partyId, data) {
  return apiRequest.post(`/admin/pr-contracts/${contractId}/parties/${partyId}/sign`, data)
}

export function apiGetPRContractProperty(contractId) {
  return apiRequest.get(`/admin/pr-contracts/${contractId}/property`)
}

export function apiCreatePRContractProperty(contractId, data) {
  return apiRequest.post(`/admin/pr-contracts/${contractId}/property`, data)
}

export function apiPatchPRContractProperty(contractId, data) {
  return apiRequest.put(`/admin/pr-contracts/${contractId}/property`, data)
}

export function apiGetPRContractCommissions(contractId) {
  return apiRequest.get(`/admin/contracts/${contractId}/payments/commissions`)
}

export function apiGetPRContractPayments(contractId) {
  return apiRequest.get(`/admin/contracts/${contractId}/payments`)
}

export function apiGetPRContractSummaryPayments(contractId) {
  return apiRequest.get(`/admin/contracts/${contractId}/payments/summary`)
}

export function apiCreatePRContractPayment(contractId, data) {
  return apiRequest.post(`/admin/contracts/${contractId}/payments`, data)
}

export function apiCreatePRContractInvoice(contractId) {
  return apiRequest.get(`/pr-contracts/${contractId}/add_invoice_manual`)
}

export function apiUpdatePRContractPayment(contractId, paymentId, data) {
  return apiRequest.put(`/admin/contracts/${contractId}/payments/${paymentId}`, data)
}

export function apiDeletePRContractPayment(contractId, paymentId) {
  return apiRequest.delete(`/admin/contracts/${contractId}/payments/${paymentId}`)
}

export function apiCreatePRContractMonthlyRentPayment(contractId, data) {
  return apiRequest.post(`/admin/contracts/${contractId}/payments/monthly-rent`, data)
}

export function apiFinalizePRContractPayments(contractId, data) {
  return apiRequest.post(`/admin/contracts/${contractId}/payments/finalize`, data)
}

export function apiMarkContractPaymentAsPaid(contractId, paymentId) {
  return apiRequest.post(`/admin/contracts/${contractId}/payments/${paymentId}/mark-as-paid`)
}

export function apiGetContractClauses(contractId) {
  return apiRequest.get(`/admin/contracts/${contractId}/clauses`)
}

export function apiCreateContractClause(contractId, data) {
  return apiRequest.post(`/admin/contracts/${contractId}/clauses`, data)
}

export function apiUpdateContractClause(contractId, clauseId, data) {
  return apiRequest.put(`/admin/contracts/${contractId}/clauses/${clauseId}`, data)
}

export function apiDeleteContractClause(contractId, clauseId) {
  return apiRequest.delete(`/admin/contracts/${contractId}/clauses/${clauseId}`)
}

export function apiGenerateContractPDF(contractId) {
  return apiRequest.post(`/admin/contracts/${contractId}/pdf-file`)
}

export function apiSetCustomPDFFile(contractId, data) {
  return apiRequest.post(`/admin/contracts/${contractId}/custom-pdf-file`, data)
}

export function apiGetContractDescriptions(contractId) {
  return apiRequest.get(`/admin/contracts/descriptions/${contractId}`)
}

export function apiPostContractDescriptions(data) {
  return apiRequest.post('/admin/contracts/descriptions', data)
}

const getQK = (contractId) => ['pr-contracts', contractId, 'detail']

export const useGetPRCListQuery = (params, options) => {
  return useQuery({
    queryKey: ['pr-contracts-list'].concat(params),
    queryFn: () => apiRequest.get('/admin/pr-contracts/list', { params }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    options,
  })
}

export const useGetPRCDetail = (contractId) => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: getQK(contractId),
    queryFn: () => apiRequest.get(`/admin/pr-contracts/${contractId}`),
  })

  return { isPending, isError, data, error }
}

export const usePatchPRCStatus = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiRequest.patch(`/admin/pr-contracts/${contractId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQK(contractId) })
      options?.onSuccess?.()
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const usePatchPRCTrackingCode = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiRequest.patch(`/admin/pr-contracts/${contractId}/tracking-code`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: getQK(contractId) })
      options?.onSuccess?.(res)
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const useUpdatePRContractDetails = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiRequest.put(`/admin/pr-contracts/${contractId}/details`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQK(contractId) })
      queryClient.invalidateQueries({ queryKey: getPaymentsQK(contractId) })
      options?.onSuccess?.()
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const useCreatePRContract = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post('/admin/pr-contracts', data),
    onSuccess: (data) => options?.onSuccess?.(data),
    onError: (error) => options?.onError?.(error),
  })
}

export const useReferToParties = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiRequest.patch(`/admin/pr-contracts/${contractId}/refer-to-parties`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: getQK(contractId) })
      options?.onSuccess?.(res)
    },
    onError: (error) => options?.onError?.(error),
  })
}
