import { useMutation } from '@tanstack/react-query'
import { apiSendFileToRealtorByCategory, apiSendFileToRealtorByIds } from '@/data/api/market'

/**
 * send file to realtor by category
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendFileToRealtorByCategory = (options = {}) => {
  return useMutation({
    mutationFn: apiSendFileToRealtorByCategory,
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * send file to realtor by ids
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useSendFileToRealtorByIds = (options = {}) => {
  return useMutation({
    mutationFn: apiSendFileToRealtorByIds,
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
  })
}
