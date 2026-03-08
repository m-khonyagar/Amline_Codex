import { useState, useEffect } from 'react'

const useSettings = (key, initialValue) => {
  const [state, setState] = useState(undefined)

  useEffect(() => {
    let settings = window.localStorage.getItem(process.env.NEXT_PUBLIC_APP_SETTINGS_KEY)
    settings = JSON.parse(settings) || {}
    setState(settings[key] || initialValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setValue = (value) => {
    let settings = window.localStorage.getItem(process.env.NEXT_PUBLIC_APP_SETTINGS_KEY)
    settings = JSON.parse(settings) || {}
    const updatedSettings = {
      ...settings,
      [key]: value,
    }
    window.localStorage.setItem(
      process.env.NEXT_PUBLIC_APP_SETTINGS_KEY,
      JSON.stringify(updatedSettings)
    )
    setState(value)
  }

  return [state, setValue]
}

export default useSettings
