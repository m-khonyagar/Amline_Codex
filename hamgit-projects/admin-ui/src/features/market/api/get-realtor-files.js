import { apiGetRealtorFileInfo, apiGetRealtorFiles } from '@/data/api/market'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * get realtor files
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetRealtorFiles = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['realtor-files-list', params],
    queryFn: () => apiGetRealtorFiles(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    ...options,
  })
}

/**
 * get realtor file info
 * @param {number} fileId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetRealtorFileInfo = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['realtor-file', fileId],
    queryFn: () => apiGetRealtorFileInfo(fileId),
    select: (res) => res.data,
    enabled: !!fileId,
    ...options,
  })
}
