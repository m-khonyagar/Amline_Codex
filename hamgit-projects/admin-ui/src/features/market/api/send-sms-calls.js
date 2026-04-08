import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiSendSms, apiSendFileCall } from '@/data/api/market'

/**
 * send sms
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendSms = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiSendSms,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['all-history-file', variables.file_id],
        type: 'all',
      })
      queryClient.invalidateQueries({ queryKey: ['file-texts', variables.file_id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * send file call
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendFileCall = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiSendFileCall,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['all-history-file', variables.file_id],
        type: 'all',
      })
      queryClient.invalidateQueries({ queryKey: ['file-calls', variables.file_id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}
