import { apiCreateRealtorFiles } from '@/data/api/market'
import { useMutation } from '@tanstack/react-query'

/**
 * create a realtor file
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useCreateRealtorFiles = (options = {}) => {
  return useMutation({
    mutationFn: apiCreateRealtorFiles,
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
  })
}
