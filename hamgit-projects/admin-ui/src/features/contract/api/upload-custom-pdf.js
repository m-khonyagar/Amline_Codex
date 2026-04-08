import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiSetCustomPDFFile } from '@/data/api/prcontract'
import { apiUploadFile } from '@/data/api/file'
import { FileType } from '@/data/enums/file_enums'
import { handleErrorOnSubmit } from '@/utils/error'
import { generateGetPRContractInfoQuery } from './get-pr-contract-info'

/**
 * upload custom PDF file and assign to contract mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUploadCustomPdf = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, signal }) => {
      // First, upload the file
      const uploadResult = await apiUploadFile(FileType.CONTRACT_PDF, file, signal)

      // Get the file ID from the upload result
      // The response structure can be: uploadResult.data.id or uploadResult.id
      const fileId = uploadResult?.data?.id || uploadResult?.id || uploadResult?.file_id

      if (!fileId) {
        throw new Error('Failed to get file ID from upload response')
      }

      // Then assign the file ID to the contract
      const result = await apiSetCustomPDFFile(contractId, { file_id: fileId })

      return result
    },
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractInfoQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
    onError: (error, variables, context) => {
      handleErrorOnSubmit(error)
      options?.onError?.(error, variables, context)
    },
  })
}

export default useUploadCustomPdf
