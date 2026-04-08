import { useMutation } from '@tanstack/react-query'
import { apiGetPaymentLink, apiSendLinkViaSMS } from '@/data/api/prcontract'

/**
 * get payment link of a pr-contract
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useGetPaymentLink = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiGetPaymentLink(data),
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}

/**
 * send payment link to user via sms
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendPaymentLinkViaSMS = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiSendLinkViaSMS(data),
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}
