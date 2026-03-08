import getConfig from 'next/config'
import { createInstance } from './instance'

const { publicRuntimeConfig } = getConfig()

const apiRequest = createInstance(publicRuntimeConfig.API_URL)

export { apiRequest }
