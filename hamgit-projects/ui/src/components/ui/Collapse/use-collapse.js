// Source ==>> https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/components/Collapse/use-collapse.ts

import PropTypes from 'prop-types'
import { useState, useRef } from 'react'
import { flushSync } from 'react-dom'
import { mergeRefs } from '@/hooks/use-merged-ref'
import { useDidUpdate } from '@/hooks/use-did-update'

function getAutoHeightDuration(height) {
  if (!height || typeof height === 'string') {
    return 0
  }
  const constant = height / 36
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}

export function getElementHeight(el) {
  return el?.current ? el.current.scrollHeight : 'auto'
}

const raf = typeof window !== 'undefined' && window.requestAnimationFrame

export function useCollapse({
  opened,
  onTransitionEnd,
  transitionDuration,
  transitionTimingFunction = 'ease',
}) {
  const el = useRef(null)
  const collapsedHeight = 0
  const collapsedStyles = {
    height: 0,
    display: 'none',
    overflow: 'hidden',
  }
  const [styles, setStylesRaw] = useState(opened ? {} : collapsedStyles)
  const setStyles = (newStyles) => {
    flushSync(() => setStylesRaw(newStyles))
  }

  const mergeStyles = (newStyles) => {
    setStyles((oldStyles) => ({ ...oldStyles, ...newStyles }))
  }

  function getTransitionStyles(height) {
    const duration = transitionDuration || getAutoHeightDuration(height)
    return {
      transition: `height ${duration}ms ${transitionTimingFunction}`,
    }
  }

  useDidUpdate(() => {
    if (opened) {
      raf(() => {
        mergeStyles({ willChange: 'height', display: 'block', overflow: 'hidden' })
        raf(() => {
          const height = getElementHeight(el)
          mergeStyles({ ...getTransitionStyles(height), height })
        })
      })
    } else {
      raf(() => {
        const height = getElementHeight(el)
        mergeStyles({ ...getTransitionStyles(height), willChange: 'height', height })
        raf(() => mergeStyles({ height: collapsedHeight, overflow: 'hidden' }))
      })
    }
  }, [opened])

  const handleTransitionEnd = (e) => {
    if (e.target !== el.current || e.propertyName !== 'height') {
      return
    }

    if (opened) {
      const height = getElementHeight(el)

      if (height === styles.height) {
        setStyles({})
      } else {
        mergeStyles({ height })
      }

      onTransitionEnd?.()
    } else if (styles.height === collapsedHeight) {
      setStyles(collapsedStyles)
      onTransitionEnd?.()
    }
  }

  function getCollapseProps({ style = {}, refKey = 'ref', ...rest } = {}) {
    const theirRef = rest[refKey]
    return {
      [refKey]: mergeRefs(el, theirRef),
      onTransitionEnd: handleTransitionEnd,
      style: { boxSizing: 'border-box', ...style, ...styles },
    }
  }

  return getCollapseProps
}

useCollapse.propTypes = {
  opened: PropTypes.bool.isRequired,
  transitionDuration: PropTypes.number,
  onTransitionEnd: PropTypes.func,
  transitionTimingFunction: PropTypes.string,
}
