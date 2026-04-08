import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../services'

export const getPaymentsQK = (contractId) => ['pr-contracts', contractId, 'payments']
const getSummaryQK = (contractId) => ['pr-contracts', contractId, 'payments', 'summary']
const getCommissionsQK = (contractId) => ['pr-contracts', contractId, 'payments', 'commissions']

export const useGetContractPayments = (contractId) => {
  const payments = useQuery({
    queryKey: getPaymentsQK(contractId),
    queryFn: () => apiRequest.get(`/admin/contracts/${contractId}/payments`),
  })
  return payments
}

export const useCreateContractPayments = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiRequest.post(`/admin/contracts/${contractId}/payments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPaymentsQK(contractId) })
      options?.onSuccess?.()
    },
    onError: (e) => {
      options?.onError?.(e)
    },
  })
}

export const useUpdateContractPayments = (payment, options = {}) => {
  const queryClient = useQueryClient()
  const url = `/admin/contracts/${payment.contract.id}/payments/${payment.id}`
  return useMutation({
    mutationFn: (data) => apiRequest.put(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPaymentsQK(payment.contract.id) })
      options?.onSuccess?.()
    },
    onError: (e) => {
      options?.onError?.(e)
    },
  })
}

export const useDeleteContractPayments = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payment) =>
      apiRequest.delete(`/admin/contracts/${contractId}/payments/${payment.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPaymentsQK(contractId) })
      options?.onSuccess()
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const useGetContractPaymentsSummary = (contractId) => {
  return useQuery({
    queryKey: getSummaryQK(contractId),
    queryFn: () => apiRequest.get(`/admin/contracts/${contractId}/payments/summary`),
  })
}

export const useFinalizeContractPayments = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  const url = `/admin/contracts/${contractId}/payments/finalize`

  return useMutation({
    mutationFn: (data) => apiRequest.post(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getPaymentsQK(contractId) })
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: getCommissionsQK(contractId) })
      }, 1000)
      options?.onSuccess?.()
    },
    onError: (e) => {
      options?.onError?.(e)
    },
  })
}

export const useCreateMonthlyRentPayment = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  const url = `/admin/contracts/${contractId}/payments/monthly-rent`
  return useMutation({
    mutationFn: (data) => apiRequest.post(url, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: getPaymentsQK(contractId) })
      options?.onSuccess?.(response)
    },
    onError: (e) => {
      options?.onError?.(e)
    },
  })
}

// /admin/contracts/{contract_id}/payments/commissions
export const useGetContractCommissions = (contractId) => {
  return useQuery({
    queryKey: getCommissionsQK(contractId),
    queryFn: () => apiRequest.get(`/admin/contracts/${contractId}/payments/commissions`),
  })
}

export const useMarkPaymentAsPaid = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (paymentId) =>
      apiRequest.post(`/admin/contracts/${contractId}/payments/${paymentId}/mark-as-paid`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getCommissionsQK(contractId) })
      options?.onSuccess?.()
    },
    onError: (e) => {
      options?.onError?.(e)
    },
  })
}
