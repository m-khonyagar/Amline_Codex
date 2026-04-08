import { useMutation } from '@tanstack/react-query'
import { apiSendUserText } from '@/data/api/user'

/**
 * send user text
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendUserText = (options = {}) => {
  return useMutation({
    mutationFn: apiSendUserText,
    ...options,
  })
}
