import { useMemo } from 'react'
import { useAuthContext } from '@/features/auth'

/**
 * Custom hook to check if a user has the required roles/permissions.
 *
 * @param {string[]} requiredRoles - Array of roles required to have permission
 * @param {Object} [options={}] - Configuration options for permission checking
 * @param {boolean} [options.requireAll=false] - If true, user must have ALL required roles. If false, user needs ANY of the required roles (default: false)
 * @param {boolean} [options.exclude=false] - If true, inverts the logic: user should NOT have the required roles to get permission (default: false)
 * @returns {boolean} Returns true if user has permission based on the rules, false otherwise
 *
 * @example
 * // Normal mode: Check if user has 'admin' or 'editor' role
 * const hasPermission = useHasPermission(['admin', 'editor'])
 * // Returns true if user has 'admin' OR 'editor'
 *
 * @example
 * // Require all roles
 * const hasPermission = useHasPermission(['admin', 'editor'], { requireAll: true })
 * // Returns true only if user has BOTH 'admin' AND 'editor'
 *
 * @example
 * // Exclude mode: Deny access if user has 'admin' or 'moderator' role
 * const hasPermission = useHasPermission(['admin', 'moderator'], { exclude: true })
 * // Returns true if user does NOT have 'admin' AND does NOT have 'moderator'
 *
 * @example
 * // Exclude with requireAll: Deny access only if user has ALL specified roles
 * const hasPermission = useHasPermission(['admin', 'superuser'], { exclude: true, requireAll: true })
 * // Returns true if user does NOT have both 'admin' AND 'superuser' (user can have one of them)
 */
export function useHasPermission(requiredRoles, options = {}) {
  const { requireAll = false, exclude = false } = options

  const { currentUser } = useAuthContext()
  const userRoles = useMemo(() => currentUser?.roles || [], [currentUser?.roles])

  return useMemo(() => {
    if (!requiredRoles.length) return true

    const roleSet = new Set(userRoles)

    if (exclude) {
      // If exclude is true, user should NOT have any of the requiredRoles
      if (requireAll) {
        // User should not have ALL of the required roles
        return !requiredRoles.every((role) => roleSet.has(role))
      } else {
        // User should not have ANY of the required roles
        return !requiredRoles.some((role) => roleSet.has(role))
      }
    } else {
      // Normal mode: user must have the required roles
      if (requireAll) {
        return requiredRoles.every((role) => roleSet.has(role))
      } else {
        return requiredRoles.some((role) => roleSet.has(role))
      }
    }
  }, [userRoles, requiredRoles, requireAll, exclude])
}
