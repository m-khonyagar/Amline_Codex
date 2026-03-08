import { useMutation } from '@tanstack/react-query'
import { apiClaimedToHavePaid } from '@/data/api/contract'
import { useOptimisticUpdateContractPayments } from './get-contract-payments'

const useClaimedToHavePaid = (contractId, paymentId, options = {}) => {
  const updateContractPayments = useOptimisticUpdateContractPayments()

  return useMutation({
    mutationFn: () => apiClaimedToHavePaid(contractId, paymentId),

    ...options,

    onSuccess: (res) => {
      updateContractPayments.update(null, contractId)
      options.onSuccess?.(res)
    },
  })
}

export default useClaimedToHavePaid
