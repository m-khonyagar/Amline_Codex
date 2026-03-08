import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiUpdateContractClause } from '@/data/api/prcontract'
import { generateGetContractClausesQuery } from './get-contract-clauses'

/**
 * update contract clause mutation
 * @param {number} contractId
 * @param {number} clauseId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useUpdateContractClause = (contractId, clauseId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiUpdateContractClause(contractId, clauseId, data),
    ...options,
    onSuccess: (res, variables, context) => {
      queryClient.setQueriesData(
        { queryKey: generateGetContractClausesQuery(contractId).queryKey },
        (oldData) => {
          return {
            ...oldData,
            data: oldData.data.map((c) => (c.id === res.data.id ? res.data : c)),
          }
        }
      )

      options?.onSuccess?.(res, variables, context)
    },
  })
}

export default useUpdateContractClause
