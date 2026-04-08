import { apiRequest } from '@/data/services'

export function apiGetProvinces() {
  return apiRequest.get(`/provinces`)
}

export function apiGetCities() {
  return apiRequest.get(`/provinces/cities`)
}

export function apiGetProvinceCities(provinceId) {
  return apiRequest.get(`/provinces/${provinceId}`)
}

export function apiGetDistrict(cityId) {
  return apiRequest.get(`/provinces/cities/${cityId}/districts`)
}

export function apiCreateDistrict(cityId, data) {
  return apiRequest.post(`/provinces/cities/${cityId}/districts`, data)
}

export function apiUpdateDistrict(districtId, data) {
  return apiRequest.put(`/provinces/districts/${districtId}`, data)
}

export function apiDeleteDistrict(districtId) {
  return apiRequest.delete(`/provinces/districts/${districtId}`)
}

export function apiGetRegions(cityId) {
  return apiRequest.get(`/crm/tools/ajax/${cityId}/regions`)
}
