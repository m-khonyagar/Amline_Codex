import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY

function checkIfValidIP(str) {
  // Regular expression to check if string is a IP address
  const regexExp =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi

  return regexExp.test(str)
}

/**
 * get domain option fot using in cookie
 */
function getDomainForCookie() {
  const hostname = window.location.hostname

  if (['localhost'].includes(hostname) || checkIfValidIP(hostname)) {
    return hostname
  }

  const domain = hostname.split('.').slice(-2).join('.')

  return domain
  // return domain !== 'localhost' ? `.${domain}` : domain
}

// Access Token

export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token) {
  const expires = 365
  const domain = getDomainForCookie()
  Cookies.set(ACCESS_TOKEN_KEY, token, { expires, domain, path: '/' })
}

export function hasAccessToken() {
  return !!Cookies.get(ACCESS_TOKEN_KEY)
}

export function removeAccessToken() {
  const domain = getDomainForCookie()
  Cookies.remove(ACCESS_TOKEN_KEY, { domain, path: '/' })
}

// Refresh Token

export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token) {
  const expires = 365
  const domain = getDomainForCookie()
  Cookies.set(REFRESH_TOKEN_KEY, token, { expires, domain, path: '/' })
}

export function hasRefreshToken() {
  return !!Cookies.get(REFRESH_TOKEN_KEY)
}

export function removeRefreshToken() {
  const domain = getDomainForCookie()
  Cookies.remove(REFRESH_TOKEN_KEY, { domain, path: '/' })
}
