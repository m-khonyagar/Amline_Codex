import { createInstance } from './instance'

const apiRequest = createInstance(import.meta.env.VITE_API_BASE_URL)

export { apiRequest }
