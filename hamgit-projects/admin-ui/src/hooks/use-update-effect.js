import { useEffect, useRef } from 'react'

/**
 * A custom hook that runs an effect only on updates, not on the initial mount.
 * This is useful when you want to skip the effect on the first render but run it
 * on subsequent renders when dependencies change.
 *
 * @param {Function} effect - The effect function to run on updates
 * @param {Array} deps - Array of dependencies to watch for changes
 * @returns {void}
 *
 * @example
 * // Only log when count changes, not on initial mount
 * useUpdateEffect(() => {
 *   console.log('Count changed to:', count)
 * }, [count])
 *
 * @example
 * // Skip API call on initial mount, only fetch when filters change
 * useUpdateEffect(() => {
 *   fetchData(filters)
 * }, [filters])
 */
export function useUpdateEffect(effect, deps) {
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
