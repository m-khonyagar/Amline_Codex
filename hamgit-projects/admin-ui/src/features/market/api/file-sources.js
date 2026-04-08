import { useMutation, useQuery } from '@tanstack/react-query'
import {
  apiGetFileSources,
  apiCreateFileSource,
  apiUpdateFileSource,
  apiDeleteFileSource,
} from '@/data/api/market'

/**
 * get file sources
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetFileSources = (options = {}) => {
  return useQuery({
    queryKey: ['file-sources'],
    queryFn: apiGetFileSources,
    select: (res) => res.data,
    ...options,
  })
}

/**
 * create file source
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useCreateFileSource = (options = {}) => {
  return useMutation({
    mutationFn: apiCreateFileSource,
    ...options,
  })
}

/**
 * update file source
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useUpdateFileSource = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, title }) => apiUpdateFileSource(id, { title }),
    ...options,
  })
}

/**
 * create file source
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useDeleteFileSource = (options = {}) => {
  return useMutation({
    mutationFn: apiDeleteFileSource,
    ...options,
  })
}
