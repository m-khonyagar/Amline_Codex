import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiAddReportTask, apiCreateTask, apiUpdateTask } from '@/data/api/market'

/**
 * create task
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useCreateTask = (options = {}) => {
  return useMutation({
    mutationFn: apiCreateTask,
    ...options,
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * update task
 * @param {number} taskId
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useUpdateTask = (taskId, options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => apiUpdateTask(taskId, data),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      options.onSuccess?.(data, variables, context)
    },
  })
}

/**
 * add a report
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useAddReportTask = (options = {}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiAddReportTask,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.task_id] })
      options.onSuccess?.(data, variables, context)
    },
  })
}
