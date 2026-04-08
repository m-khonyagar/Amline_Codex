import { useMutation } from '@tanstack/react-query'
import { apiExportContract } from '@/data/api/contract'

/**
 * export contract file
 * @param {number} contractId contract id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useExportContract = (contractId, options = {}) => {
  return useMutation({
    mutationFn: () => apiExportContract(contractId),
    ...options,
  })
}

export default useExportContract
