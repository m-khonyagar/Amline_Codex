import {
  apiGetAllHistoryFiles,
  apiGetFileCalls,
  apiGetFileTexts,
  apiGetHistoryFiles,
  apiGetRealtorSharedFiles,
} from '@/data/api/market'
import { useQuery } from '@tanstack/react-query'

/**
 * get all history file
 * @param {number} fileId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetAllHistoryFiles = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['all-history-file', fileId],
    queryFn: () => apiGetAllHistoryFiles(fileId),
    select: (res) => res.data,
    ...options,
  })
}

/**
 * get history files
 * @param {number} fileId
 * @param {object} params - Query parameters like fields, filter_type
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetHistoryFiles = (fileId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['history-file', fileId, params],
    queryFn: () => apiGetHistoryFiles(fileId, params),
    select: (res) => res.data,
    ...options,
  })
}

/**
 * get file texts
 * @param {number} fileId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetFileTexts = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['file-texts', fileId],
    queryFn: () => apiGetFileTexts(fileId),
    select: (res) => res.data,
    ...options,
  })
}

/**
 * get file calls
 * @param {number} fileId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetFileCalls = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['file-calls', fileId],
    queryFn: () => apiGetFileCalls(fileId),
    select: (res) => res.data,
    ...options,
  })
}

/**
 * get realtor shared files
 * @param {number} fileId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetRealtorSharedFiles = (fileId, options = {}) => {
  return useQuery({
    queryKey: ['realtor-shared-files', fileId],
    queryFn: () => apiGetRealtorSharedFiles(fileId),
    select: (res) => res.data,
    ...options,
  })
}
