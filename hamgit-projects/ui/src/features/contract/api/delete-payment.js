import { useMutation } from '@tanstack/react-query'
import { apiDeletePrContractPayment, apiDeletePrContractAllPayments } from '@/data/api/payment'
import { paymentFormTypeEnum, prContractPaymentTypeEnum } from '@/features/contract'

/**
 * Delete payment by id
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeletePayment = (options = {}) => {
  return useMutation({
    mutationFn: ({ contractId, paymentId, paymentFormType }) => {
      if (
        paymentFormType === paymentFormTypeEnum.CASH ||
        paymentFormType === paymentFormTypeEnum.CHEQUE
      ) {
        return apiDeletePrContractPayment(contractId, paymentId)
      }

      if (paymentFormType === paymentFormTypeEnum.MONTHLY) {
        return apiDeletePrContractAllPayments(contractId, prContractPaymentTypeEnum.RENT)
      }

      throw new Error('payment form type enum not found')
    },

    ...options,

    onSuccess: (res) => {
      options.onSuccess?.(res)
    },
  })
}

export default useDeletePayment
