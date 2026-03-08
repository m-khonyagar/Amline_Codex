export function parseEitaaData(queryString) {
  try {
    // Parse the query string into URLSearchParams
    const params = new URLSearchParams(queryString)

    // Convert to object
    const result = {}

    // Add basic fields
    result.auth_date = params.get('auth_date')
    result.device_id = params.get('device_id')
    result.query_id = params.get('query_id')
    result.hash = params.get('hash')

    // Parse user data - fix the malformed Unicode escapes first
    const userJson = params.get('user')
    if (userJson) {
      // Fix /uXXXX to \uXXXX format
      const fixedUserJson = userJson.replace(/\/u([0-9a-fA-F]{4})/g, '\\u$1')
      result.user = JSON.parse(fixedUserJson)
    }

    return result
  } catch (err) {
    console.error('Failed to parse Eitaa data:', err)
    return null
  }
}
