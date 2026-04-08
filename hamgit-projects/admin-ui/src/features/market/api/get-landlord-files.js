import { apiGetLandlordFileInfo, apiGetLandlordFiles } from '@/data/api/market'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * get landlord files
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetLandlordFiles = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['landlord-files-list', params],
    queryFn: () => apiGetLandlordFiles(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    ...options,
  })
}

/**
 * get landlord file info
 * @param {number} fileId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetLandlordFileInfo = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['landlord-file', fileId],
    queryFn: () => apiGetLandlordFileInfo(fileId),
    select: (res) => res.data,
    enabled: !!fileId,
    ...options,
  })
}
