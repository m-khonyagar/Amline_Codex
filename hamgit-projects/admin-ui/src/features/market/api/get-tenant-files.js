import { apiGetTenantFileInfo, apiGetTenantFiles } from '@/data/api/market'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * get tenant files
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetTenantFiles = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['tenant-files-list', params],
    queryFn: () => apiGetTenantFiles(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    ...options,
  })
}

/**
 * get tenant file info
 * @param {number} fileId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetTenantFileInfo = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['tenant-file', fileId],
    queryFn: () => apiGetTenantFileInfo(fileId),
    select: (res) => res.data,
    enabled: !!fileId,
    ...options,
  })
}
