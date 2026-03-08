import { useHasPermission } from '@/hooks/use-permission'

/**
 * PermissionGuard component that conditionally renders children based on user permissions.
 *
 * @param {Object} props - Component props
 * @param {Array} props.requiredRoles - Array of roles required to access the content
 * @param {Object} [props.options] - Options object
 * @param {boolean} [props.options.requireAll=false] - Whether all roles are required (default: any role)
 * @param {boolean} [props.options.exclude=false] - If true, inverts the logic: user should NOT have the required roles to get permission (default: false)
 * @param {ReactNode} [props.children] - Content to render if permissions are met
 * @param {ReactNode} [props.fallback] - Content to render if permissions are not met (optional)
 * @returns {ReactNode} The rendered content based on permissions
 */
export function PermissionGuard({ requiredRoles, options = {}, children, fallback = null }) {
  const hasPermission = useHasPermission(requiredRoles, options)
  return hasPermission ? children : fallback
}
