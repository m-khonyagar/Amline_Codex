import { isServerSide } from '@/utils/environment'
import { apiRefreshToken } from '@/data/api/auth'
import {
  getAccessToken,
  getRefreshToken,
  hasRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from './token'

/**
 * add auth token request interceptor to axios instance
 * @param {import('axios').AxiosInstance} instance
 */
const addAuthTokenInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken(config.req)
      return {
        ...config,
        headers: {
          ...(config?.headers || {}),
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      }
    },
    null,
    { synchronous: true }
  )
}

// Create a list to hold the request queue
const refreshAndRetryQueue = []
// Flag to prevent multiple token refresh requests
let isRefreshing = false

const redirectToLoginPage = async (error) => {
  // redirect to login page
  const _isServerSide = isServerSide()
  removeAccessToken(error.config.req, error.config.res)
  removeRefreshToken(error.config.req, error.config.res)

  if (_isServerSide) {
    if (error.config.req && error.config.res) {
      error.config.res
        .writeHead(302, {
          Location: `/auth?prev=${encodeURIComponent(error.config.req.url)}`,
        })
        .end()
    }
  } else {
    await new Promise(() => {
      window.location.replace(`/auth?prev=${encodeURIComponent(window.location.href)}`)
    })
  }
}

/**
 * add refresh token response interceptor to axios instance
 * @param {import('axios').AxiosInstance} instance
 */
const addRefreshTokenInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response && error.response.status === 401) {
        if (!isRefreshing && hasRefreshToken()) {
          isRefreshing = true
          try {
            // Refresh the access token
            const response = await apiRefreshToken(getRefreshToken())
            const newAccessToken = response.data.access_token
            const newRefreshToken = response.data.refresh_token
            setAccessToken(newAccessToken)
            setRefreshToken(newRefreshToken)

            // Update the request headers with the new access token
            // error.config.headers.Authorization = `Bearer ${newAccessToken}`

            // Retry all requests in the queue with the new token
            refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
              instance
                .request(config)
                .then((res) => resolve(res))
                .catch((err) => reject(err))
            })

            // Clear the queue
            refreshAndRetryQueue.length = 0

            // Retry the original request
            return instance(originalRequest)
          } catch (refreshError) {
            // Handle token refresh error
            await redirectToLoginPage(error)
            throw refreshError
          } finally {
            isRefreshing = false
          }
        } else {
          await redirectToLoginPage(error)
        }

        // Add the original request to the queue
        return new Promise((resolve, reject) => {
          refreshAndRetryQueue.push({ config: originalRequest, resolve, reject })
        })
      }

      // Return a Promise rejection if the status code is not 401
      return Promise.reject(error)
    }
  )
}

/**
 * add auth request and response interceptors to axios instance
 * @param {import('axios').AxiosInstance} instance
 */
const addAuthInterceptors = (instance) => {
  addAuthTokenInterceptor(instance)
  addRefreshTokenInterceptor(instance)
}

export { addAuthInterceptors }
