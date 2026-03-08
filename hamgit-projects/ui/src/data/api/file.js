import getConfig from 'next/config'
import { apiRequest } from '../services'

const { publicRuntimeConfig } = getConfig()

export const getUploadUrl = () => {
  return `${publicRuntimeConfig.API_URL}/files/upload`
}

export function apiDownloadFile(fileId) {
  return apiRequest.get(`/files/download/${fileId}`, { responseType: 'blob' })
}

export async function apiUploadFile(fileType, file, signal) {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('file_type', fileType)

  // TOTO: signal don't work, https://github.com/TehShrike/deepmerge/issues/249
  const result = await apiRequest.post('/files/upload', formData, { signal })

  if (result?.status === true) {
    return result.data
  }

  return result
}
