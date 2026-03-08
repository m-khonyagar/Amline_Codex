import { apiRequest } from '../services'

/**
 * Fetches a report from the CRM tools endpoint
 *
 * @param {Object} data - The report configuration data. Provide either duration OR start_date/end_date
 * @param {("MONTHLY"|"WEEKLY"|"DAILY")} [data.duration] - The duration type for the report. Use this OR start_date/end_date
 * @param {string} [data.start_date] - The start date for the report in YYYY-MM-DD format. Use this with end_date OR use duration
 * @param {string} [data.end_date] - The end date for the report in YYYY-MM-DD format. Use this with start_date OR use duration
 *
 * @returns {Promise} A promise that resolves to the API response containing the report data
 *
 * @example
 * // Get a monthly report using duration
 * const reportData = {
 *   duration: "MONTHLY"
 * };
 * const report = await apiGetReport(reportData);
 *
 * @example
 * // Get a custom date range report
 * const reportData = {
 *   start_date: "2025-09-01",
 *   end_date: "2025-09-30"
 * };
 * const report = await apiGetReport(reportData);
 */
export function apiGetReport(data) {
  return apiRequest.post('/crm/tools/report', data)
}
