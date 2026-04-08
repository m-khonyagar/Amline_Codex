import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../services'

const useGetContractClauses = (contractId) => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['pr-contracts', contractId, 'clauses'],
    queryFn: () => apiRequest.get(`/admin/contracts/${contractId}/clauses`),
  })

  return { isPending, isError, data, error }
}

const useGetContractClauseDetail = (contractId, clauseId) => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['pr-contracts', clauseId, 'clause-detail'],
    queryFn: () => apiRequest.get(`/admin/contracts/${contractId}/clauses/${clauseId}`),
  })

  return { isPending, isError, data, error }
}

const useCreateContractClause = (contractId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data }) => {
      return apiRequest.post(`/admin/contracts/${contractId}/clauses`, data)
    },
    ...options,
    onSuccess: (response) => {
      queryClient.setQueriesData(
        { queryKey: ['pr-contracts', contractId, 'clauses'] },
        (oldData) => {
          return { ...oldData, data: [...oldData.data, response.data] }
        }
      )
      options?.onSuccess()
    },
    onError: (e) => {
      options?.onError?.(e)
    },
  })
}

const useEditContractClause = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clause, data }) =>
      apiRequest.put(`/admin/contracts/${clause.contract.id}/clauses/${clause.id}`, data),
    ...options,
    onSuccess: (res) => {
      queryClient.setQueriesData(
        { queryKey: ['pr-contracts', res.data.contract.id, 'clauses'] },
        (oldData) => {
          return {
            ...oldData,
            data: oldData.data.map((c) => (c.id === res.data.id ? res.data : c)),
          }
        }
      )
      options?.onSuccess?.(res)
    },
    onError: (e) => {
      options?.onError?.(e)
    },
  })
}

const useDeleteContractClause = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clause }) => {
      return apiRequest.delete(`/admin/contracts/${clause.contract.id}/clauses/${clause.id}`)
    },
    ...options,
    onSuccess: (_, { clause }) => {
      queryClient.setQueriesData(
        { queryKey: ['pr-contracts', clause.contract.id, 'clauses'] },
        (oldData) => {
          return { ...oldData, data: oldData.data.filter((c) => c.id !== clause.id) }
        }
      )
      options?.onSuccess()
    },
    onError: (e) => {
      options?.onError(e)
    },
  })
}

export {
  useCreateContractClause,
  useDeleteContractClause,
  useEditContractClause,
  useGetContractClauseDetail,
  useGetContractClauses,
}
