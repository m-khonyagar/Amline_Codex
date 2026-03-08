import { useEffect, useState } from 'react'

/**
 * useDebounce
 * Returns a debounced value that updates only after the delay.
 *
 * @param value - The value to debounce (string, number, object, etc.)
 * @param delay - Delay in milliseconds (default: 350ms)
 */
const useDebounce = (value, delay = 350) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export { useDebounce }
