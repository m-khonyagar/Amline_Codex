import { useMutation } from '@tanstack/react-query'
import { apiDownloadFile } from '@/data/api/file'

/**
 * download file by id mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDownloadFile = (options = {}) => {
  return useMutation({
    mutationFn: async (fileId) => {
      const result = await apiDownloadFile(fileId)

      return result.data
    },
    ...options,
  })
}

export default useDownloadFile
