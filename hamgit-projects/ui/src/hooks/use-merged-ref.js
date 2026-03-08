/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import { useCallback } from 'react'

export function assignRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (typeof ref === 'object' && ref !== null && 'current' in ref) {
    ref.current = value
  }
}

export function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => assignRef(ref, node))
  }
}

export function useMergedRef(...refs) {
  return useCallback(mergeRefs(...refs), refs)
}
