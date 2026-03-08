import { apiGetReport } from '@/data/api/dashboard'
import { useQuery } from '@tanstack/react-query'

/**
 * React Query hook to fetch dashboard report data
 *
 * @param {Object} reportData - The report configuration data. Provide either duration OR start_date/end_date
 * @param {("MONTHLY"|"WEEKLY"|"DAILY")} [reportData.duration] - The duration type for the report. Use this OR start_date/end_date
 * @param {string} [reportData.start_date] - The start date for the report in YYYY-MM-DD format. Use this with end_date OR use duration
 * @param {string} [reportData.end_date] - The end date for the report in YYYY-MM-DD format. Use this with start_date OR use duration
 * @param {import('@tanstack/react-query').UseQueryOptions} options - Additional React Query options
 *
 * @returns {import('@tanstack/react-query').UseQueryResult} The query result containing report data, loading state, and error information
 *
 * @example
 * // Using duration
 * const { data, isLoading, error } = useGetReport({
 *   duration: "MONTHLY"
 * });
 *
 * @example
 * // Using custom date range
 * const { data, isLoading, error } = useGetReport({
 *   start_date: "2025-09-01",
 *   end_date: "2025-09-30"
 * });
 *
 * @example
 * // With custom options
 * const { data, isLoading, error } = useGetReport(
 *   { duration: "WEEKLY" },
 *   {
 *     enabled: true,
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *     refetchOnWindowFocus: false
 *   }
 * );
 */
export const useGetReport = (reportData, options = {}) => {
  return useQuery({
    queryKey: ['dashboard-report', reportData],
    queryFn: () => apiGetReport(reportData),
    select: (res) => res.data,
    enabled: !!(reportData?.duration || (reportData?.start_date && reportData?.end_date)),
    ...options,
  })
}
