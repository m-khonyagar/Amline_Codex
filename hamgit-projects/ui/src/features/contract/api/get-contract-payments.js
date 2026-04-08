import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGetContractPayments } from '@/data/api/payment'

const contractPaymentsQueryKey = ['contracts-payments']

const generateGetContractPaymentsQueryKey = (id) => {
  return contractPaymentsQueryKey.concat(Number(id))
}

/**
 * get contract payments
 * @param contractId
 * @param options
 */
const useGetContractPayments = (contractId, options = {}) => {
  return useQuery({
    queryKey: generateGetContractPaymentsQueryKey(contractId),

    queryFn: () => apiGetContractPayments(contractId),

    select: (res) => res.data,

    ...options,
  })
}

const useOptimisticUpdateContractPayments = () => {
  const queryClient = useQueryClient()

  const update = (payment, contractId) => {
    queryClient.invalidateQueries({
      queryKey: generateGetContractPaymentsQueryKey(contractId),
    })
  }

  const _delete = (contractId, paymentId) => {
    queryClient.setQueryData(generateGetContractPaymentsQueryKey(contractId), (oldData) =>
      oldData.data.filter((d) => d.id !== paymentId)
    )
  }

  return { update, delete: _delete }
}

export default useGetContractPayments
export { generateGetContractPaymentsQueryKey, useOptimisticUpdateContractPayments }
