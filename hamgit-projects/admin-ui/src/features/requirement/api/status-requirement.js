import {
  apiAcceptRequirement,
  apiDeArchiveRequirement,
  apiRejectRequirement,
} from '@/data/api/requirement'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * accept a requirement
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useAcceptRequirement = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiAcceptRequirement,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['requirement', variables] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * reject a requirement
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useRejectRequirement = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiRejectRequirement,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['requirement', variables] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * deArchive a requirement
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useDeArchiveRequirement = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiDeArchiveRequirement,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['requirement', variables] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export { useAcceptRequirement, useRejectRequirement, useDeArchiveRequirement }
