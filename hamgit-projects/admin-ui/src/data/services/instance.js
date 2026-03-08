import axios from 'axios'
import { addAuthInterceptors } from './request'

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
    timeout: 60000,
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
