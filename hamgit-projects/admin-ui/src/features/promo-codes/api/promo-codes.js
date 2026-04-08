import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiBulkGeneratePromoCode, apiGeneratePromoCode } from '@/data/api/promo-codes'

/**
 * Hook for generating a single promo code
 * @param {import('@tanstack/react-query').UseMutationOptions} - Mutation options
 * @returns {import('@tanstack/react-query').UseMutationResult} Mutation object
 */
export const useGeneratePromoCode = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiGeneratePromoCode,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'], type: 'all' })
      options.onSuccess?.()
    },
  })
}

/**
 * Hook for generating bulk promo codes
 * @param {import('@tanstack/react-query').UseMutationOptions} - Mutation options
 * @returns {import('@tanstack/react-query').UseMutationResult} Mutation object
 */
export const useBulkGeneratePromoCode = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiBulkGeneratePromoCode,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'], type: 'all' })
      options.onSuccess?.()
    },
  })
}

// /**
//  * Hook for updating promo code
//  * @param {Object} options - Mutation options
//  * @returns {Object} Mutation object
//  */
// export const useUpdatePromoCode = (options = {}) => {
//   return useMutation({
//     mutationFn: ({ id, data }) => apiUpdatePromoCode(id, data),
//     ...options,
//   })
// }

// /**
//  * Hook for deleting promo code
//  * @param {Object} options - Mutation options
//  * @returns {Object} Mutation object
//  */
// export const useDeletePromoCode = (options = {}) => {
//   return useMutation({
//     mutationFn: apiDeletePromoCode,
//     ...options,
//   })
// }
