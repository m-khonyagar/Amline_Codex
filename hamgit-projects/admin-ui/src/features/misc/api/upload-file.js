import { useMutation } from '@tanstack/react-query'
import { apiUploadFile } from '@/data/api/file'

/**
 * upload file mutation
 * @param {object} param0
 * @param {number} param0.fileType
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUploadFile = ({ fileType }, options = {}) => {
  return useMutation({
    mutationFn: ({ file, signal }) => apiUploadFile(fileType, file, signal),
    ...options,
  })
}

export default useUploadFile
