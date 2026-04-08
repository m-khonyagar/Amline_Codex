import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services/index.js'

export function apiGetAds(params) {
  return apiRequest.get('/admin/ads/properties', { params })
}

export function apiGetAdInfo(id) {
  return apiRequest.get(`/admin/ads/properties/${id}`)
}

const useGetAds = (params, options = {}) => {
  return useQuery({
    queryKey: ['ads-list'].concat({ ...params }),
    queryFn: () => apiRequest.get(`/admin/ads/properties`, { params }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    ...options,
  })
}

export function apiAcceptAd(id) {
  return apiRequest.post(`/admin/ads/properties/${id}/accept`)
}

const useAcceptAd = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.post(`/admin/ads/properties/${id}/accept`),
    ...options,
  })
}

export function apiRejectAd(id) {
  return apiRequest.post(`/admin/ads/properties/${id}/reject`)
}

export function apiDeArchiveAd(id) {
  return apiRequest.post(`/admin/ads/properties/${id}/dearchive`)
}

const useRejectAd = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.post(`/admin/ads/properties/${id}/reject`),
    ...options,
  })
}

export function apiPostAd(data) {
  return apiRequest.post(`/admin/ads/properties`, data)
}

const useCreateAd = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post(`/admin/ads/properties`, data),
    ...options,
  })
}

export function apiPatchAd(id, data) {
  return apiRequest.patch(`/admin/ads/properties/${id}`, data)
}

const useUpdateAd = (id, options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.patch(`/admin/ads/properties/${id}`, data),
    ...options,
  })
}

export function apiDeleteAd(id) {
  return apiRequest.delete(`/admin/ads/properties/${id}`)
}

const useDeleteAd = (options = {}) => {
  return useMutation({
    mutationFn: (id) => apiRequest.delete(`/admin/ads/properties/${id}`),
    ...options,
  })
}

export function apiGetAdsVisitRequests(params) {
  return apiRequest.get(`/admin/ads/visit-requests`, { params })
}

const useGetAdsVisitRequests = (params, options = {}) => {
  return useQuery({
    queryKey: ['ads-visit-requests-list'].concat({ ...params }),
    queryFn: () => apiRequest.get(`/admin/ads/visit-requests`, { params }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
    ...options,
  })
}

export function apiAcceptAdVisitRequest(data) {
  return apiRequest.post(`/admin/ads/visit-requests/accept`, data)
}

const useAcceptAdVisitRequests = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post('/admin/ads/visit-requests/accept', data),
    ...options,
  })
}

export function apiRejectAdVisitRequest(data) {
  return apiRequest.post('/admin/ads/visit-requests/reject', data)
}

const useRejectAdVisitRequests = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiRequest.post(`/admin/ads/visit-requests/reject`, data),
    ...options,
  })
}

export {
  useGetAds,
  useAcceptAd,
  useRejectAd,
  useCreateAd,
  useUpdateAd,
  useDeleteAd,
  useGetAdsVisitRequests,
  useAcceptAdVisitRequests,
  useRejectAdVisitRequests,
}
