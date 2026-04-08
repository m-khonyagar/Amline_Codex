import { useImperativeHandle, useRef } from 'react'

function useFallbackRef(forwardedRef) {
  const ref = useRef(null)

  useImperativeHandle(forwardedRef, () => ref.current)

  return ref
}

export default useFallbackRef
