import { useEffect, useState } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState()

  useEffect(() => {
    const value = window.localStorage.getItem(key)
    setState(value ? JSON.parse(value) : initialValue)
  }, [key, initialValue])

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      setState(value)
    } catch (error) {
      console.error(error)
    }
  }

  return [state, setValue]
}

export default useLocalStorage
