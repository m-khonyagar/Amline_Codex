import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiConfirmPRContractPartySignOTP } from '@/data/api/prcontract'
import { generateGetPRContractPartiesQuery } from './get-pr-contract-parties'

/**
 * confirm pr contract party sign otp mutation
 * @param {number} contractId
 * @param {number} partyId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useConfirmPRContractPartySignOTP = (contractId, partyId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiConfirmPRContractPartySignOTP(contractId, partyId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: generateGetPRContractPartiesQuery(contractId).queryKey,
      })

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useConfirmPRContractPartySignOTP
