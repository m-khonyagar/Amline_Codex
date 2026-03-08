import PropTypes from 'prop-types'
import { useEffect, useRef, useMemo } from 'react'

import classes from './SegmentedControl.module.scss'
import { cn } from '@/utils/dom'
import useIsMounted from '@/hooks/use-is-mounted'
import { useUncontrolled } from '@/hooks/use-uncontrolled'

function SegmentedControl({ name, segments, value, onChange, onDisabledClick, className = '' }) {
  const containerRef = useRef()
  const isMounted = useIsMounted()
  const [localValue, setLocalValue] = useUncontrolled({
    value,
    onChange,
    defaultValue: value === undefined ? segments[0] : undefined,
  })

  const activeIndex = useMemo(
    () => segments.findIndex((s) => s.value === localValue.value),
    [segments, localValue]
  )

  useEffect(() => {
    const activeSegmentEl = containerRef.current.querySelector(`.${classes['segment--selected']}`)
    const { offsetWidth, offsetLeft } = activeSegmentEl
    const { style } = containerRef.current
    style.setProperty('--highlight-width', `${offsetWidth}px`)
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`)
  }, [localValue, containerRef, segments])

  const onInputChange = (newValue) => {
    if (newValue.disabled) {
      onDisabledClick?.(newValue)
      return
    }
    setLocalValue(newValue)
  }

  return (
    <div className={classes.container} ref={containerRef}>
      <div
        className={cn(classes.controls, className, { [classes['controls--ready']]: isMounted() })}
      >
        {segments?.map((item, i) => (
          <div
            key={item.value}
            className={cn(classes.segment, {
              [classes['segment--disabled']]: item.disabled,
              [classes['segment--selected']]: i === activeIndex,
            })}
          >
            <input
              name={name}
              type="radio"
              id={item.label}
              value={item.value}
              checked={i === activeIndex}
              onChange={() => onInputChange(item)}
            />
            <label htmlFor={item.label}>{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

SegmentedControl.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onDisabledClick: PropTypes.func,
  value: PropTypes.shape({
    label: PropTypes.node,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      disabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
}

export default SegmentedControl
