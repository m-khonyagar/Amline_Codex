import { useEffect, useState } from 'react'
import { copyToClipboard } from '@/utils/copy'

const useCopy = (value) => {
  const [isCopied, setIsCopied] = useState(false)

  const copy = (_value) => {
    copyToClipboard(_value || value)

    setIsCopied(true)
  }

  useEffect(() => {
    let timeout = null

    if (isCopied) {
      timeout = setTimeout(() => setIsCopied(false), 2000)
    }

    return () => {
      clearTimeout(timeout)
    }
  })

  return { copy, isCopied }
}

export { useCopy }
