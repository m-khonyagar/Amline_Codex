import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  apiCreateContractClauses,
  apiDeleteContractClauses,
  apiEditContractClauses,
  apiGetContractClauses,
} from '@/data/api/contract'

const contractClausesQueryKey = ['contract-clauses-query-key']

const generateContractClausesKey = (id) => {
  return contractClausesQueryKey.concat(Number(id))
}

const useGetContractClauses = (contractId, options = {}) => {
  return useQuery({
    queryKey: generateContractClausesKey(contractId),
    queryFn: () => apiGetContractClauses(contractId),
    select: (res) => res.data,
    ...options,
  })
}

const useCreateContractClauses = (contractId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiCreateContractClauses(contractId, data),

    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateContractClausesKey(contractId), (oldData) => {
        return {
          data: [...oldData.data, res.data],
        }
      })

      options.onSuccess?.(res)
    },
  })
}

const useEditContractClauses = (contractId, clauseId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => apiEditContractClauses(contractId, clauseId, data),
    ...options,

    onSuccess: (res) => {
      queryClient.setQueryData(generateContractClausesKey(contractId), (oldData) => {
        return {
          data: oldData.data.map((clause) => (clause.id === clauseId ? res.data : clause)),
        }
      })

      options.onSuccess?.(res)
    },
  })
}

const useDeleteContractClauses = (contractId, clauseId, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiDeleteContractClauses(contractId, clauseId),
    ...options,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: generateContractClausesKey(contractId) })

      options.onSuccess?.(res)
    },
  })
}

export {
  useGetContractClauses,
  useCreateContractClauses,
  useEditContractClauses,
  useDeleteContractClauses,
}
