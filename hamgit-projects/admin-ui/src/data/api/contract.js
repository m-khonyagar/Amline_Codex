import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../services/index.js'

export function apiStartContract(data) {
  return apiRequest.post(`/admin/contracts/start`, data)
}

export function apiCreateEmptyContract(data) {
  return apiRequest.post(`/admin/contracts/create-empty`, data)
}

export function apiRealtorStartContract(data) {
  return apiRequest.post(`/admin/contracts/realtor-start`, data)
}

const useGenerateContractPdf = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contractId) => apiRequest.post(`/admin/contracts/${contractId}/pdf-file`),
    ...options,
    onSuccess: (res, contractId) => {
      options?.onSuccess?.(res)
      queryClient.invalidateQueries({ queryKey: ['pr-contracts', contractId, 'detail'] })
    },
  })
}

const useDeleteContract = (options = {}) => {
  return useMutation({
    mutationFn: (contractId) => apiRequest.delete(`/admin/${contractId}`),
    ...options,
  })
}

export { useGenerateContractPdf, useDeleteContract }
