import { useMutation } from '@tanstack/react-query'
import { apiSignContract } from '@/data/api/signature'

/**
 * send OTP sign mutation
 * @param contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useSignContract = (contractId, options = {}) => {
  return useMutation({
    mutationFn: () => apiSignContract(contractId),
    ...options,
  })
}

export default useSignContract
