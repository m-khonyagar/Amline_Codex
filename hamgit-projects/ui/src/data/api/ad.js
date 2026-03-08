import { apiRequest } from '../services'

export function apiPostAd(data) {
  return apiRequest.post('/ads/properties', data)
}

export function apiGetAd(id) {
  return apiRequest.get(`/ads/properties/${id}`)
}

export function apiPatchAd(id, data) {
  return apiRequest.patch(`/ads/properties/${id}`, data)
}

export function apiDeleteAd(id) {
  return apiRequest.delete(`/ads/properties/${id}`)
}

export function apiGetAdsList(params) {
  return apiRequest.get('/ads/properties', {
    params,
    paramsSerializer: {
      indexes: null,
    },
  })
}

export function apiGetMyAds() {
  return apiRequest.get('/ads/properties/current-user')
}

export function apiAdsVisitRequests(data) {
  return apiRequest.post('/ads/visit-requests', data)
}

export function apiGetSimilarAds(adId) {
  return apiRequest.get(`/ads/properties/${adId}/similar-ads`)
}

export function apiGetSimilarWantedAds(adId) {
  return apiRequest.get(`/ads/properties/${adId}/similar-wanted-ads`)
}
