import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../services'

const getQK = (contractId) => ['pr-contracts', contractId, 'parties']

export const useGetPRCParties = (contractId) => {
  return useQuery({
    queryKey: getQK(contractId),
    queryFn: () => apiRequest.get(`/admin/pr-contracts/${contractId}/parties`),
  })
}

export const useUpdatePRCParty = (contractId, partyId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) =>
      apiRequest.put(`/admin/pr-contracts/${contractId}/parties/${partyId}`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: getQK(contractId) })
      options?.onSuccess?.(data)
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const useVerifyPartyInformation = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiRequest.post('/admin/users/verify-information', data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pr-contracts', 'parties'] })
      options?.onSuccess?.(data)
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const useSendContractSignOtp = (party, options = {}) => {
  return useMutation({
    mutationFn: () =>
      apiRequest.post(`/admin/pr-contracts/${party.contract.id}/parties/${party.id}/otp-sign/send`),
    onSuccess: (res) => options?.onSuccess?.(res),
    onError: (e) => options?.onError?.(e),
  })
}

export const useConfirmContractSignOtp = (party, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) =>
      apiRequest.post(
        `/admin/pr-contracts/${party.contract.id}/parties/${party.id}/otp-sign/confirm`,
        data
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: getQK(party.contract.id) })
      options?.onSuccess?.(res)
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const useSignContract = (party, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) =>
      apiRequest.post(`/admin/pr-contracts/${party.contract.id}/parties/${party.id}/sign`, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: getQK(party.contract.id) })
      options?.onSuccess?.(res)
    },
    onError: (e) => options?.onError?.(e),
  })
}
