import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGenerateContractPDF } from '@/data/api/prcontract'
import { generateGetPRContractInfoQuery } from './get-pr-contract-info'

/**
 * generate contract pdf mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useGenerateContractPdf = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiGenerateContractPDF(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractInfoQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useGenerateContractPdf
