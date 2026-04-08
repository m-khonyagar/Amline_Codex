import { useMutation } from '@tanstack/react-query'
import { useOptimisticUpdateContractPayments } from './get-contract-payments'
import {
  apiCreatePaymentCash,
  apiCreatePaymentCheque,
  apiCreateRentPaymentMonthlyRent,
} from '@/data/api/payment'
import { paymentFormTypeEnum } from '@/features/contract'

/**
 * @param {number} contractId contract id
 * @param {number} paymentFormType payment category Enum
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useCreateContractPayment = (contractId, paymentFormType, options = {}) => {
  const updateContractPayments = useOptimisticUpdateContractPayments()

  return useMutation({
    mutationFn: (data) => {
      if (paymentFormType === paymentFormTypeEnum.CASH) {
        return apiCreatePaymentCash(contractId, data)
      }

      if (paymentFormType === paymentFormTypeEnum.CHEQUE) {
        return apiCreatePaymentCheque(contractId, data)
      }

      if (paymentFormType === paymentFormTypeEnum.MONTHLY) {
        return apiCreateRentPaymentMonthlyRent(contractId, data)
      }

      throw new Error('payment form type enum not found')
    },

    ...options,

    onSuccess: (res) => {
      updateContractPayments.update(res.data, contractId)

      options.onSuccess?.(res)
    },
  })
}

export default useCreateContractPayment
