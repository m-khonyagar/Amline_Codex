import { useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook to manage collapsible elements with dynamic height adjustment.
 *
 * @param {boolean} open - Determines whether the collapsible element is open or closed.
 * @param {Object} [options] - Options for the collapsible element.
 * @param {number} [options.maxHeight] - The maximum height the element can expand to, in pixels.
 * @param {*} [options.dependency] - A dependency that triggers a re-evaluation of the collapsible element's height.
 * @returns {{
 *   ref: import('react').RefObject<HTMLElement>,
 *   recalculateHeight: () => void
 * }} An object containing the ref and recalculation function.
 */
export default function useCollapse(open, { maxHeight, dependency } = {}) {
  const ref = useRef(null)

  const recalculateHeight = useCallback(() => {
    const el = ref.current
    if (!el) return

    if (open) {
      const fullHeight = el.scrollHeight
      el.style.maxHeight = `${maxHeight ? Math.min(maxHeight, fullHeight) : fullHeight}px`
    } else {
      el.style.maxHeight = '0px'
    }
  }, [open, maxHeight])

  useEffect(() => {
    recalculateHeight()
  }, [recalculateHeight, dependency])

  return { ref, recalculateHeight }
}
