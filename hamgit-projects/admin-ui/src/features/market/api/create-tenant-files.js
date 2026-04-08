import { apiCreateTenantFiles } from '@/data/api/market'
import { useMutation } from '@tanstack/react-query'

/**
 * create a tenant file
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useCreateTenantFiles = (options = {}) => {
  return useMutation({
    mutationFn: apiCreateTenantFiles,
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
  })
}
