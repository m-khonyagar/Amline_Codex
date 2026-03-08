import axios from 'axios'
import { env } from '@/config/env'

export const httpApi = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
})
