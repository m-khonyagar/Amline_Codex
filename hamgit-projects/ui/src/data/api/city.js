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
