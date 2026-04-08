import PropTypes from 'prop-types'
import { forwardRef, useId } from 'react'
import style from './Checkbox.module.scss'
import { cn } from '@/utils/dom'
import { CheckboxCheckBoldIcon, CheckboxIcon } from '@/components/icons'
import { useUncontrolled } from '@/hooks/use-uncontrolled'

const Checkbox = forwardRef(
  (
    {
      label,
      value,
      name,
      children,
      onChange,
      className,
      inputProps,
      id: propId,
      defaultChecked,
      checked: propChecked,
      disabled = false,
    },
    ref
  ) => {
    const defaultId = useId()
    const id = propId || defaultId

    const [isChecked, setIsChecked, isControlled] = useUncontrolled({
      onChange,
      value: propChecked,
      defaultValue: defaultChecked,
      finalValue: false,
    })

    const onInputChange = (event) => {
      setIsChecked(isControlled ? event : event.target.checked)
    }

    const handleLabelKeyDown = (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault()
        setIsChecked(!isChecked)
      }
    }

    return (
      <div className={cn[(style.checkbox, className)]}>
        <input
          id={id}
          ref={ref}
          aria-hidden
          name={name}
          className="hidden"
          value={value || ''}
          checked={!!isChecked}
          type="checkbox"
          tabIndex={-1}
          onChange={(event) => onInputChange(event)}
          disabled={disabled}
          {...inputProps}
        />
        <label htmlFor={id} className="flex gap-2 select-none">
          <div tabIndex="0" onKeyDown={handleLabelKeyDown} role="button">
            {isChecked ? (
              <CheckboxCheckBoldIcon color="#179A9C" />
            ) : (
              <CheckboxIcon color="#BCBEC2" />
            )}
          </div>

          <span>{label}</span>
          {children}
        </label>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

Checkbox.propTypes = {
  label: PropTypes.node,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
}

export default Checkbox
