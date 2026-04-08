import { useMutation, useQuery } from '@tanstack/react-query'
import { apiRequest } from '../services'

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

const useGetFile = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['file', fileId],
    queryFn: async () => {
      const result = await apiRequest.get(`/files/download/${fileId}`, { responseType: 'blob' })

      return result.data
    },

    enabled: !!fileId,
    ...options,
  })
}

const useUploadFile = ({ fileType }, options = {}) => {
  return useMutation({
    mutationFn: ({ file, signal }) => apiUploadFile(fileType, file, signal),
    ...options,
  })
}

const useDownloadFile = (options = {}) => {
  return useMutation({
    mutationFn: async (fileId) => {
      const result = await apiRequest.get(`/files/download/${fileId}`, { responseType: 'blob' })

      return result.data
    },
    ...options,
  })
}

export { useDownloadFile, useGetFile, useUploadFile }
