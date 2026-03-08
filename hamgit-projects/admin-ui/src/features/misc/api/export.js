import { apiRequest } from '@/data/services'
import { useMutation } from '@tanstack/react-query'

export const useDownloadPhonesExcel = (options = {}) => {
  return useMutation({
    mutationFn: async (data) => {
      const result = await apiRequest.post('/crm/tools/phones-excel', data, {
        responseType: 'blob',
      })
      return result.data
    },
    ...options,
  })
}
