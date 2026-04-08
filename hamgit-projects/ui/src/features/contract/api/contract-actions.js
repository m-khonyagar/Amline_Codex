import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRejectContract, apiRevisionRequestContract } from '@/data/api/contract'
import { generateGetContractStatusQueryKey } from './get-contract-status'

const useRejectContract = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiRejectContract(contractId),
    ...options,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: generateGetContractStatusQueryKey(contractId) })

      options.onSuccess?.(res)
    },
  })
}

const useRevisionRequestContract = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiRevisionRequestContract(contractId),
    ...options,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: generateGetContractStatusQueryKey(contractId) })

      options.onSuccess?.(res)
    },
  })
}

export { useRejectContract, useRevisionRequestContract }
