import { apiRequest } from '@/data/services/requests'

export function apiGetCurrentUser() {
  return apiRequest.get('/users/me')
}

export function apiPatchCurrentUser(data) {
  return apiRequest.put('/users/update', data)
}

export function apiPatchNickname(data) {
  return apiRequest.patch('/users/nickname', data)
}

export function apiGetBookmarks() {
  return apiRequest.get('/users/saved-ads')
}

export function apiPostBookmark(data) {
  return apiRequest.post('/users/saved-ads', data)
}

export function apiDeleteAvatar() {
  return apiRequest.delete('/users/user-profile')
}

export function apiDeleteBookmark(adId) {
  return apiRequest.delete(`/users/saved-ads/${adId}`)
}
