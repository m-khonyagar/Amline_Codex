/* eslint-disable no-nested-ternary */
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { isClientSide, isProduction } from '@/utils/environment'

const ACCESS_TOKEN_KEY = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'accessToken'
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'refreshToken'

function checkIfValidIP(str) {
  // Regular expression to check if string is a IP address
  const regexExp =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi

  return regexExp.test(str)
}

/**
 * get domain option fot using in cookie
 * @param {import('http').IncomingMessage} [req]
 */
function getDomainForCookie(req) {
  const isInProduction = isProduction()

  const hostname = isClientSide()
    ? window.location.hostname
    : req
      ? req.headers.host
      : isInProduction
        ? 'amline.ir'
        : 'localhost'

  if (['localhost'].includes(hostname) || checkIfValidIP(hostname)) {
    return hostname
  }

  return `.${hostname.split('.').slice(-2).join('.')}`
}

// Access Token

export function getAccessToken(req) {
  return getCookie(ACCESS_TOKEN_KEY, { req })
}

export function setAccessToken(token) {
  const maxAge = 365 * 24 * 60 * 60
  const domain = getDomainForCookie()
  setCookie(ACCESS_TOKEN_KEY, token, { maxAge, domain, path: '/' })
}

export function hasAccessToken(req) {
  return !!getCookie(ACCESS_TOKEN_KEY, { req })
}

export function removeAccessToken(req, res) {
  const domain = getDomainForCookie()
  deleteCookie(ACCESS_TOKEN_KEY, { req, res, domain, path: '/' })
}

// Refresh Token

export function getRefreshToken(req) {
  return getCookie(REFRESH_TOKEN_KEY, { req })
}

export function setRefreshToken(token) {
  const maxAge = 365 * 24 * 60 * 60
  const domain = getDomainForCookie()
  setCookie(REFRESH_TOKEN_KEY, token, { maxAge, domain, path: '/' })
}

export function hasRefreshToken(req) {
  return !!getCookie(REFRESH_TOKEN_KEY, { req })
}

export function removeRefreshToken(req, res) {
  const domain = getDomainForCookie(req)
  deleteCookie(REFRESH_TOKEN_KEY, { req, res, domain })
}
