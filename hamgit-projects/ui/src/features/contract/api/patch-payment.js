import { useMutation } from '@tanstack/react-query'
import { apiPatchPaymentCash, apiPatchPaymentCheque } from '@/data/api/payment'
import { useOptimisticUpdateContractPayments } from './get-contract-payments'
import { paymentMethodEnum } from '@/features/contract'

/**
 * update payment by id
 * @param {number} paymentId payment id
 * @param {number} paymentMethod payment method Enum
 * @param contractId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const usePatchPayment = (contractId, paymentId, paymentMethod, options = {}) => {
  const updateContractPayments = useOptimisticUpdateContractPayments()

  return useMutation({
    mutationFn: (data) => {
      if (paymentMethod === paymentMethodEnum.CASH) {
        return apiPatchPaymentCash(contractId, paymentId, data)
      }

      if (paymentMethod === paymentMethodEnum.CHEQUE) {
        return apiPatchPaymentCheque(contractId, paymentId, data)
      }

      throw new Error('payment method not found')
    },

    ...options,

    onSuccess: (res) => {
      updateContractPayments.update(res.data, contractId)

      options.onSuccess?.(res)
    },
  })
}

export default usePatchPayment
