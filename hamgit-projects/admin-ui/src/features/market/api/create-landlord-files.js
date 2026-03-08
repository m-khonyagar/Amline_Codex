import { apiCreateLandlordFiles } from '@/data/api/market'
import { useMutation } from '@tanstack/react-query'

/**
 * create a landlord file
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useCreateLandlordFiles = (options = {}) => {
  return useMutation({
    mutationFn: apiCreateLandlordFiles,
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
  })
}
