import { useMutation } from '@tanstack/react-query'
import { apiSendPRContractPartySignOTP } from '@/data/api/prcontract'

/**
 * send pr contract party sign otp mutation
 * @param {number} contractId
 * @param {number} partyId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useSendPRContractPartySignOTP = (contractId, partyId, options = {}) => {
  return useMutation({
    mutationFn: (data) => apiSendPRContractPartySignOTP(contractId, partyId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useSendPRContractPartySignOTP
