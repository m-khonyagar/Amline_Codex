import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services/index.js'

export const apiGetRequirements = (params) => {
  return apiRequest.get(`/admin/ads/wanted/properties`, { params })
}

export const apiGetRequirementInfo = (id) => {
  return apiRequest.get(`/admin/ads/wanted/properties/${id}`)
}

const useGetRequirements = (params, options = {}) => {
  return useQuery({
    queryKey: ['requirement-list'].concat({ ...params }),
    queryFn: () => apiRequest.get(`/admin/ads/wanted/properties`, { params }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    ...options,
  })
}

export const apiAcceptRequirement = (id) => {
  return apiRequest.patch(`/admin/ads/wanted/properties/${id}/accept`)
}

const UseAcceptRequirement = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.patch(`/admin/ads/wanted/properties/${id}/accept`),
    ...options,
  })
}

export const apiRejectRequirement = (id) => {
  return apiRequest.patch(`/admin/ads/wanted/properties/${id}/reject`)
}

export const apiDeArchiveRequirement = (id) => {
  return apiRequest.post(`/admin/ads/wanted/properties/${id}/dearchive`)
}

const UseRejectRequirement = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.patch(`/admin/ads/wanted/properties/${id}/reject`),
    ...options,
  })
}

export const apiCreateRequirement = (data) => {
  return apiRequest.post(`/admin/ads/wanted/properties`, data)
}

const useCreateRequirement = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post(`/admin/ads/wanted/properties`, data),
    ...options,
  })
}

export const apiUpdateRequirement = (id, data) => {
  return apiRequest.patch(`/admin/ads/wanted/properties/${id}`, data)
}

const useUpdateRequirement = (id, options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.patch(`/admin/ads/wanted/properties/${id}`, data),
    ...options,
  })
}

export const apiDeleteRequirement = (id) => {
  return apiRequest.delete(`/admin/ads/wanted/properties/${id}`)
}

const useDeleteRequirement = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.delete(`/admin/ads/wanted/properties/${id}`),
    ...options,
  })
}

export const apiGetExchanges = (params) => {
  return apiRequest.get(`/admin/ads/swaps`, { params })
}

export const apiGetExchangeInfo = (id) => {
  return apiRequest.get(`/admin/ads/swaps/${id}`)
}

const useGetExchanges = (params, options = {}) => {
  return useQuery({
    queryKey: ['exchange-list'].concat({ ...params }),
    queryFn: () => apiRequest.get(`/admin/ads/swaps`, { params }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    ...options,
  })
}

export const apiCreateExchange = (data) => {
  return apiRequest.post(`/admin/ads/swaps`, data)
}

const useCreateExchange = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post(`/admin/ads/swaps`, data),
    ...options,
  })
}

export const apiUpdateExchange = (id, data) => {
  return apiRequest.patch(`/admin/ads/swaps/${id}`, data)
}

const useUpdateExchange = (id, options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.patch(`/admin/ads/swaps/${id}`, data),
    ...options,
  })
}

export const apiDeleteExchange = (id) => {
  return apiRequest.delete(`/admin/ads/swaps/${id}`)
}

const useDeleteExchange = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.delete(`/admin/ads/swaps/${id}`),
    ...options,
  })
}

export const apiAcceptExchange = (id) => {
  return apiRequest.patch(`/admin/ads/swaps/${id}/accept`)
}

const useAcceptExchange = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.patch(`/admin/ads/swaps/${id}/accept`),
    ...options,
  })
}

export const apiRejectExchange = (id) => {
  return apiRequest.patch(`/admin/ads/swaps/${id}/reject`)
}

const useRejectExchange = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.patch(`/admin/ads/swaps/${id}/reject`),
    ...options,
  })
}

export {
  useGetRequirements,
  UseAcceptRequirement,
  UseRejectRequirement,
  useCreateRequirement,
  useUpdateRequirement,
  useDeleteRequirement,
  useCreateExchange,
  useUpdateExchange,
  useDeleteExchange,
  useGetExchanges,
  useAcceptExchange,
  useRejectExchange,
}
