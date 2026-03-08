import { useMutation } from '@tanstack/react-query'
import { apiDownloadLandlordFilesExcel, apiDownloadTenantFilesExcel } from '@/data/api/market'
import { handleErrorOnSubmit } from '@/utils/error'
import { downloadBlob } from '@/utils/file'

/**
 * download landlord files excel mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useDownloadLandlordFilesExcel = (options = {}) => {
  return useMutation({
    mutationFn: async () => {
      const result = await apiDownloadLandlordFilesExcel()
      return result.data
    },
    onSuccess: (data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      downloadBlob(blob, 'landlord-files.xlsx')
    },
    onError: handleErrorOnSubmit,
    ...options,
  })
}

/**
 * download tenant files excel mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useDownloadTenantFilesExcel = (options = {}) => {
  return useMutation({
    mutationFn: async () => {
      const result = await apiDownloadTenantFilesExcel()
      return result.data
    },
    onSuccess: (data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      downloadBlob(blob, 'tenant-files.xlsx')
    },
    onError: handleErrorOnSubmit,
    ...options,
  })
}
