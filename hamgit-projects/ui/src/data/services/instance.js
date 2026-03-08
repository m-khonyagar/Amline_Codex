import axios from 'axios'
// eslint-disable-next-line no-restricted-imports
import { addAuthInterceptors } from '@/features/auth/utils/request'

const addResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (res) => res,
    (e) => {
      return Promise.reject(e)
    }
  )
}

const createPureInstance = (baseUrl, { headers, ...configs } = {}) => {
  return axios.create({
    timeout: 45000,
    baseURL: baseUrl,
    headers: {
      ...(headers || {}),
    },
    ...configs,
  })
}

const createInstance = (baseUrl, configs = {}) => {
  const instance = createPureInstance(baseUrl, configs)
  addAuthInterceptors(instance)
  addResponseInterceptor(instance)

  return instance
}

export { createPureInstance, createInstance }
