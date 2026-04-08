import { apiRequest } from '../services'

export function apiPostRequirement(data) {
  return apiRequest.post('/ads/wanted/properties', data)
}

export function apiPatchRequirement(id, data) {
  return apiRequest.patch(`/ads/wanted/properties/${id}`, data)
}

export function apiDeleteRequirement(id) {
  return apiRequest.delete(`/ads/wanted/properties/${id}`)
}

export function apiGetAllRequirement(params) {
  return apiRequest.get('/ads/wanted/properties', {
    params,
    paramsSerializer: {
      indexes: null,
    },
  })
}

export function apiPostSwap(data) {
  return apiRequest.post('/ads/swaps', data)
}

export function apiGetAllSwaps(params) {
  return apiRequest.get('/ads/swaps', { params })
}

export function apiGetRequirement(id) {
  return apiRequest.get(`/ads/wanted/properties/${id}`)
}

export function apiGetMyRequirements(params) {
  return apiRequest.get('/ads/wanted/properties/current-user', { params })
}

export function apiGetSwap(id) {
  return apiRequest.get(`/ads/swaps/${id}`)
}

export function apiGetMySwaps(params) {
  return apiRequest.get('/ads/swaps/current-user', { params })
}

export function apiPatchSwap(id, data) {
  return apiRequest.patch(`/ads/swaps/${id}`, data)
}

export function apiDeleteSwap(id) {
  return apiRequest.delete(`/ads/swaps/${id}`)
}

export function apiPostAdsReport(data) {
  return apiRequest.post('/ads/report', data)
}

export function apiGetSimilarAds(wantedId) {
  return apiRequest.get(`/ads/wanted/properties/${wantedId}/similar-ads`)
}

export function apiGetSimilarWantedAds(wantedId) {
  return apiRequest.get(`/ads/wanted/properties/${wantedId}/similar-wanted-ads`)
}
