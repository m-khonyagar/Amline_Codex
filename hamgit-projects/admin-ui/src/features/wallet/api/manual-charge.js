import { useMutation } from '@tanstack/react-query'
import { apiWalletBulkManualCharge, apiWalletManualCharge } from '@/data/api/wallet'

/**
 * wallet manual charge mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useWalletManualCharge = (options = {}) => {
  return useMutation({
    mutationFn: apiWalletManualCharge,
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}

/**
 * wallet bulk manual charge mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useWalletBulkManualCharge = (options = {}) => {
  return useMutation({
    mutationFn: apiWalletBulkManualCharge,
    ...options,
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context)
    },
  })
}

export { useWalletManualCharge, useWalletBulkManualCharge }
