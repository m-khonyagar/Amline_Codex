import { useMutation, useQuery } from '@tanstack/react-query'
import {
  apiGetFileLabels,
  apiCreateFileLabel,
  apiUpdateFileLabel,
  apiDeleteFileLabel,
} from '@/data/api/market'

/**
 * get file labels
 * @param {"USER"|"FILE"} type
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetFileLabels = (type = 'FILE', options = {}) => {
  return useQuery({
    queryKey: ['file-labels', type],
    queryFn: () => apiGetFileLabels({ type }),
    select: (res) => res.data,
    ...options,
  })
}

/**
 * create file label
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useCreateFileLabel = (options = {}) => {
  return useMutation({
    mutationFn: apiCreateFileLabel,
    ...options,
  })
}

/**
 * update file label
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useUpdateFileLabel = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, ...payload }) => apiUpdateFileLabel(id, payload),
    ...options,
  })
}

/**
 * delete file label
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useDeleteFileLabel = (options = {}) => {
  return useMutation({
    mutationFn: apiDeleteFileLabel,
    ...options,
  })
}
