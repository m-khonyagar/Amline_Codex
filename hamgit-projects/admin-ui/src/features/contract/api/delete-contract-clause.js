import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDeleteContractClause } from '@/data/api/prcontract'
import { generateGetContractClausesQuery } from './get-contract-clauses'

/**
 * delete contract clause mutation
 * @param {number} contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeleteContractClause = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clauseId) => apiDeleteContractClause(contractId, clauseId),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.setQueriesData(
        { queryKey: generateGetContractClausesQuery(contractId).queryKey },
        (oldData) => {
          return { ...oldData, data: oldData.data.filter((c) => c.id !== variables) }
        }
      )

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useDeleteContractClause
