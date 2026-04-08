import { apiSendLinkViaSMS } from '@/data/api/prcontract'
import { useMutation } from '@tanstack/react-query'

/**
 * send payment link to user via sms
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendInvoiceLinkViaSMS = (options = {}) => {
  return useMutation({
    mutationFn: (data) => apiSendLinkViaSMS(data),
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}
