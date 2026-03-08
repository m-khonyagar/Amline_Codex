import { useEffect, useRef, useState } from 'react'

/**
 * The hook internal state.
 * @typedef {Object} State
 * @property {boolean} isIntersecting - A boolean indicating if the element is intersecting.
 * @property {IntersectionObserverEntry | undefined} [entry] - The intersection observer entry.
 */

/**
 * Represents the options for configuring the Intersection Observer.
 * @typedef {Object} UseIntersectionObserverOptions
 * @property {Element | Document | null} [root] - The element used as the viewport for checking visibility of the target. Default is null.
 * @property {string} [rootMargin] - A margin around the root. Default is '0%'.
 * @property {number | number[]} [threshold] - A threshold indicating the percentage of the target's visibility needed to trigger the callback. Default is 0.
 * @property {boolean} [freezeOnceVisible] - If true, freezes the intersection state once the element becomes visible. Default is false.
 * @property {function(boolean, IntersectionObserverEntry): void} [onChange] - Callback invoked when the intersection state changes.
 * @property {boolean} [initialIsIntersecting] - The initial state of the intersection. Default is false.
 */

/**
 * The return type of the useIntersectionObserver hook.
 * Supports both tuple and object destructuring.
 * @typedef {Array & {ref: (node?: Element | null) => void, isIntersecting: boolean, entry?: IntersectionObserverEntry}} IntersectionReturn
 * @property {(node: Element | null) => void} ref - The ref callback function.
 * @property {boolean} isIntersecting - A boolean indicating if the element is intersecting.
 * @property {IntersectionObserverEntry | undefined} entry - The intersection observer entry.
 */

/**
 * Custom hook that tracks the intersection of a DOM element with its containing element or the viewport using the Intersection Observer API.
 * @param {UseIntersectionObserverOptions} [options={}] - The options for the Intersection Observer.
 * @returns {IntersectionReturn} The ref callback, a boolean indicating if the element is intersecting, and the intersection observer entry.
 * @example
 * // Example 1
 * const [ref, isIntersecting, entry] = useIntersectionObserver({ threshold: 0.5 });
 *
 * // Example 2
 * const { ref, isIntersecting, entry } = useIntersectionObserver({ threshold: 0.5 });
 */
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
  initialIsIntersecting = false,
  onChange,
} = {}) {
  const [ref, setRef] = useState(null)

  const [state, setState] = useState(() => ({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  }))

  const callbackRef = useRef()
  callbackRef.current = onChange

  const frozen = state.entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    if (!ref) return
    if (!('IntersectionObserver' in window)) return
    if (frozen) return

    let unobserve

    const observer = new IntersectionObserver(
      (entries) => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds]

        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some((threshold_) => entry.intersectionRatio >= threshold_)

          setState({ isIntersecting, entry })

          if (callbackRef.current) {
            callbackRef.current(isIntersecting, entry)
          }

          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve()
            unobserve = undefined
          }
        })
      },
      { threshold, root, rootMargin }
    )

    observer.observe(ref)

    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, JSON.stringify(threshold), root, rootMargin, frozen, freezeOnceVisible])

  const prevRef = useRef(null)

  useEffect(() => {
    if (
      !ref &&
      state.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.current !== state.entry.target
    ) {
      prevRef.current = state.entry.target
      setState({ isIntersecting: initialIsIntersecting, entry: undefined })
    }
  }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting])

  // const result = [setRef, !!state.isIntersecting, state.entry]

  // result.ref = result[0]
  // result.isIntersecting = result[1]
  // result.entry = result[2]

  return { ref: setRef, isIntersecting: !!state.isIntersecting, entry: state.entry }
}
