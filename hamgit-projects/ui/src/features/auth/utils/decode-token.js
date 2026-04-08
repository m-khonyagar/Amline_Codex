import { isClientSide } from '@/utils/environment'

/**
 * universal base64 decode
 * @param {string} str
 * @returns {string}
 */
function universalBase64Decode(str) {
  return isClientSide() ? atob(str) : Buffer.from(str, 'base64').toString('utf8')
}

/**
 * decode payload token
 * @param {string} token
 * @returns {object} parsed payload
 */
function parsePayloadJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    // atob do not work in server
    const jsonPayload = decodeURIComponent(
      universalBase64Decode(base64)
        .split('')
        .map((c) => {
          return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
        })
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * get userId from
 * @param {string} token
 * @returns {number} userId
 */
function getUserIdFromToken(token) {
  if (!token) return 0
  const parsedPayload = parsePayloadJwt(token)
  const userId = parsedPayload?.id

  return userId ? +userId : 0
}

export { universalBase64Decode, getUserIdFromToken }
