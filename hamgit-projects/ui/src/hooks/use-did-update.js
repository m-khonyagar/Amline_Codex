/* eslint-disable react-hooks/exhaustive-deps */

// Source ===> https://mantine.dev/hooks/use-did-update/

import { useRef } from 'react'
import { useIsomorphicEffect } from './use-isomorphic-effect'

export function useDidUpdate(func, dep) {
  const mounted = useRef(false)

  useIsomorphicEffect(() => {
    if (mounted.current) {
      func()
    } else {
      mounted.current = true
    }
  }, dep)
}
