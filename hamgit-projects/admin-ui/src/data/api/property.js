import { apiRequest } from '@/data/services'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const getQueryKey = (contractId) => ['pr-contracts', contractId, 'property']

export const useGetPRCProperty = (contractId) => {
  return useQuery({
    queryKey: getQueryKey(contractId),
    queryFn: () => apiRequest.get(`/admin/pr-contracts/${contractId}/property`),
  })
}

export const useCreatePRCProperty = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiRequest.post(`/admin/pr-contracts/${contractId}/property`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: getQueryKey(contractId) })
      options?.onSuccess(data)
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const useEditPRCProperty = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiRequest.put(`/admin/pr-contracts/${contractId}/property`, data),
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: getQueryKey(contractId) })
      options?.onSuccess(data)
    },
    onError: (e) => options?.onError?.(e),
  })
}

export const useCalculateRentCommission = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post('/users/calculate/rent-commission', data),
    ...options,
  })
}
