import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiCreateContractClause } from '@/data/api/prcontract'
import { generateGetContractClausesQuery } from './get-contract-clauses'

/**
 * create contract clause mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateContractClause = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiCreateContractClause(contractId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.setQueriesData(
        { queryKey: generateGetContractClausesQuery(contractId).queryKey },
        (oldData) => {
          return { ...oldData, data: [...oldData.data, res.data] }
        }
      )

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useCreateContractClause
