import { forwardRef, useId } from 'react'
import PropTypes from 'prop-types'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import style from './RadioButton.module.scss'
import { cn } from '@/utils/dom'
import { CircleCheckBoldIcon, CircleIcon } from '@/components/icons'

const RadioButton = forwardRef(
  (
    {
      label,
      value,
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

    return (
      <div className={cn[(style.checkbox, className)]}>
        <input
          ref={ref}
          className="hidden"
          value={value || ''}
          checked={!!isChecked}
          type="radio"
          id={id}
          onChange={(event) => onInputChange(event)}
          disabled={disabled}
          {...inputProps}
        />
        <label htmlFor={id} className="flex gap-2">
          {isChecked ? <CircleCheckBoldIcon color="#179A9C" /> : <CircleIcon color="#BCBEC2" />}
          <span>{label}</span>
          {children}
        </label>
      </div>
    )
  }
)

RadioButton.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
}

export default RadioButton
