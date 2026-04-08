import { apiGetTaskInfo, apiGetTasks } from '@/data/api/market'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

/**
 * get tasks
 * @param {object} params
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetTasks = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['tasks-list', params],
    queryFn: () => apiGetTasks(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    ...options,
  })
}

/**
 * get task info
 * @param {number} taskId
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useGetTaskInfo = (taskId, options = {}) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => apiGetTaskInfo(taskId),
    select: (res) => res.data,
    enabled: !!taskId,
    ...options,
  })
}
