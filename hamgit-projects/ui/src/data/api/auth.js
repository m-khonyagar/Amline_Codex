import { apiRequest } from '../services/requests'

export function apiOTPLogin({ mobile }) {
  return apiRequest.post('/auth/otp/send', {
    mobile,
  })
}
export function apiOTPLoginVoip({ mobile }) {
  return apiRequest.post('/auth/voip-otp', {
    mobile,
  })
}

export function apiConfirmCode({ mobile, otp }) {
  return apiRequest.post('/auth/otp/verify', {
    mobile,
    otp,
  })
}

export function apiLogout() {
  return apiRequest.post('/auth/logout')
}

export function apiRefreshToken(refreshToken) {
  return apiRequest.post('/auth/token/refresh', {
    refresh_token: refreshToken,
  })
}

export function apiEitaaLogin(response) {
  return apiRequest.post('/eitaa/login', { response })
}

export function apiEitaaLoginWithId(id) {
  return apiRequest.post('/eitaa/login_with_id', { eitaa_user_id: id })
}
