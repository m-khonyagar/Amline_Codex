import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPatchPRContractStatus } from '@/data/api/prcontract'
import { generateGetPRContractInfoQuery } from './get-pr-contract-info'
import { generateGetPRContractStatusQuery } from './get-pr-contract-status'

/**
 * patch pr contract status mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPRContractStatus = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiPatchPRContractStatus(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractInfoQuery(contractId).queryKey,
      })

      queryClient.invalidateQueries({
        queryKey: generateGetPRContractStatusQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default usePatchPRContractStatus
