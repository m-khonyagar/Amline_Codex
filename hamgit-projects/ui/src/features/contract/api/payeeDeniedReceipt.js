import { useMutation } from '@tanstack/react-query'
import { apiPayeeDeniedReceipt } from '@/data/api/contract'
import { useOptimisticUpdateContractPayments } from './get-contract-payments'

const usePayeeDeniedReceipt = (contractId, paymentId, options = {}) => {
  const updateContractPayments = useOptimisticUpdateContractPayments()

  return useMutation({
    mutationFn: () => apiPayeeDeniedReceipt(contractId, paymentId),

    ...options,

    onSuccess: (res) => {
      updateContractPayments.update(null, contractId)
      options.onSuccess?.(res)
    },
  })
}

export default usePayeeDeniedReceipt
