import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A custom hook for managing data in browser storage (localStorage or sessionStorage)
 *
 * @param {string} key - The storage key to use for storing/retrieving data
 * @param {any} initialValue - The initial value to use if no data exists in storage
 * @param {'localStorage' | 'sessionStorage'} [storageType='localStorage'] - The type of storage to use
 * @returns {[any, function]} A tuple containing the current value and a setter function
 *
 * @example
 * // Basic usage with localStorage (default)
 * const [data, setData] = useStorage('myKey', { name: 'John' })
 *
 * @example
 * // Using sessionStorage
 * const [sessionData, setSessionData] = useStorage('sessionKey', null, 'sessionStorage')
 *
 * @example
 * // Setting a value
 * setData({ name: 'Jane', age: 30 })
 *
 * @example
 * // Setting a value using a function
 * setData(prev => ({ ...prev, age: 31 }))
 */
const useStorage = (key, initialValue, storageType = 'localStorage') => {
  const [state, setState] = useState(initialValue)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const storage = storageType === 'sessionStorage' ? window.sessionStorage : window.localStorage

    // Get initial value
    const getValue = () => {
      try {
        const value = storage.getItem(key)
        return value ? JSON.parse(value) : initialValue
      } catch (error) {
        console.error(`Error parsing JSON for key "${key}":`, error)
        // Remove invalid data from storage
        storage.removeItem(key)
        return initialValue
      }
    }

    setState(getValue())

    // Listen for storage changes from other components
    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === storage) {
        setState(getValue())
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, storageType])

  const setValue = useCallback(
    (value) => {
      try {
        const storage =
          storageType === 'sessionStorage' ? window.sessionStorage : window.localStorage
        const valueToStore = value instanceof Function ? value(stateRef.current) : value
        storage.setItem(key, JSON.stringify(valueToStore))
        setState(valueToStore)
      } catch (error) {
        console.error(error)
      }
    },
    [key, storageType]
  )

  return [state, setValue]
}

export default useStorage
