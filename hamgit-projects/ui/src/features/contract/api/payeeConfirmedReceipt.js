import { useMutation } from '@tanstack/react-query'
import { apiPayeeConfirmedReceipt } from '@/data/api/contract'
import { useOptimisticUpdateContractPayments } from './get-contract-payments'

const usePayeeConfirmedReceipt = (contractId, paymentId, options = {}) => {
  const updateContractPayments = useOptimisticUpdateContractPayments()

  return useMutation({
    mutationFn: () => apiPayeeConfirmedReceipt(contractId, paymentId),

    ...options,

    onSuccess: (res) => {
      updateContractPayments.update(null, contractId)
      options.onSuccess?.(res)
    },
  })
}

export default usePayeeConfirmedReceipt
