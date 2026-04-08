import { apiRequest } from '../services'

/**
 * Generate a single promo code
 * @param {Object} data - Promo code data
 * @param {number} data.value - Discount value
 * @param {number} data.usage_limit - Usage limit for the code
 * @param {string} data.start_date - Start date in ISO format
 * @param {string} data.end_date - End date in ISO format
 * @param {string[]} data.roles - Array of roles that can use this code
 * @param {string} data.resource_type - Resource type (e.g., "RENT")
 * @param {string} data.discount_type - Discount type (e.g., "PERCENTAGE")
 * @param {string} data.prefix - Prefix for the promo code
 * @returns {Promise} API response
 */
export function apiGeneratePromoCode(data) {
  return apiRequest.post('/financials/promos/generate', data)
}

/**
 * Generate multiple promo codes in bulk
 * @param {Object} data - Bulk promo code data
 * @param {number} data.count - Number of codes to generate
 * @param {number} data.value - Discount value
 * @param {number} data.usage_limit - Usage limit for each code
 * @param {string} data.start_date - Start date in ISO format
 * @param {string} data.end_date - End date in ISO format
 * @param {string[]} data.roles - Array of roles that can use this code
 * @param {string} data.resource_type - Resource type (e.g., "RENT")
 * @param {string} data.discount_type - Discount type (e.g., "PERCENTAGE")
 * @param {string} data.prefix - Prefix for the promo code
 * @returns {Promise} API response
 */
export function apiBulkGeneratePromoCode(data) {
  return apiRequest.post('/financials/promos/bulk-generate', data)
}

/**
 * Get list of promo codes
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export function apiGetPromoCodes(params = {}) {
  return apiRequest.get('/financials/promos', { params })
}

// /**
//  * Update promo code
//  * @param {string|number} id - Promo code ID
//  * @param {Object} data - Updated promo code data
//  * @returns {Promise} API response
//  */
// export function apiUpdatePromoCode(id, data) {
//   return apiRequest.put(`/financials/promos/${id}`, data)
// }

// /**
//  * Delete promo code
//  * @param {string|number} id - Promo code ID
//  * @returns {Promise} API response
//  */
// export function apiDeletePromoCode(id) {
//   return apiRequest.delete(`/financials/promos/${id}`)
// }
