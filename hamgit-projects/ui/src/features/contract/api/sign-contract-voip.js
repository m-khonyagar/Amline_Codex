import { useMutation } from '@tanstack/react-query'
import { apiSignContractVoip } from '@/data/api/signature'

/**
 * send OTP sign mutation
 * @param contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useSignContractVoip = (contractId, options = {}) => {
  return useMutation({
    mutationFn: () => apiSignContractVoip(contractId),
    ...options,
  })
}

export default useSignContractVoip
