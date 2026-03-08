import { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import { cn } from '@/utils/dom'
import classes from './input.module.scss'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { toEnglishDigits } from '@/utils/number'

const Input = forwardRef(
  (
    {
      id,
      ltr,
      min,
      max,
      name,
      value,
      label,
      error,
      suffix,
      onBlur,
      onFocus,
      success,
      className,
      helperText,
      suffixIcon,
      placeholder,
      defaultValue,
      suffixAction,
      type = 'text',
      inputClassName,
      wrapperClassName,
      readOnly = false,
      multiline = false,
      isNumeric = false,
      floatError = false,
      readOnlyInput = false,
      horizontalMode = false,
      convertNumbers = false,
      onClick = () => {},
      onChange = () => {},
      ...rest
    },
    ref
  ) => {
    const caption = success || error || helperText
    const showCaption = floatError ? !!caption : true
    const Comp = !multiline ? 'input' : 'textarea'

    const [isFocused, setIsFocused] = useState(false)

    const [localValue, setLocalValue, controlled] = useUncontrolled({
      value,
      onChange,
      defaultValue,
      finalValue: '',
    })

    const handleChange = (e) => {
      if (convertNumbers) {
        e.target.value = toEnglishDigits(e.target.value)
      }
      if (isNumeric) {
        const _value = toEnglishDigits(e.target.value).replace(/[^0-9.]/g, '')
        e.target.value = Number.isNaN(Number(_value)) ? localValue : _value
      }
      setLocalValue(controlled ? e : e.target.value)
    }

    const handleFocus = (e) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e) => {
      setIsFocused(false)
      if (min !== undefined && +localValue < min) {
        e.target.value = `${min}`
        handleChange(e)
      }
      if (max !== undefined && +localValue > max) {
        e.target.value = `${max}`
        handleChange(e)
      }
      onBlur?.(e)
    }

    const handleClick = (e) => {
      if (readOnly) return

      onClick?.(e)
    }

    return (
      <div
        className={cn(classes.input, className, {
          [classes[`input--ltr`]]: ltr,
          [classes['input--has-error']]: !!error,
          [classes['input--success']]: !!success,
          [classes[`input--textarea`]]: multiline,
          [classes[`input--focused`]]: isFocused,
          [classes[`input--read-only`]]: readOnly,
          [classes[`input--horizontal`]]: horizontalMode,
        })}
      >
        {label && !horizontalMode && (
          <label className={classes.input__label} htmlFor={id}>
            {label}
          </label>
        )}

        <div className={cn(classes.input__wrapper, wrapperClassName)}>
          {label && horizontalMode && (
            <label className={classes.input__label} htmlFor={id}>
              {label}
            </label>
          )}

          <Comp
            id={id}
            min={min}
            max={max}
            ref={ref}
            name={name}
            type={type}
            value={localValue}
            onBlur={handleBlur}
            onClick={handleClick}
            onFocus={handleFocus}
            onChange={handleChange}
            readOnly={readOnly || readOnlyInput}
            placeholder={placeholder}
            className={cn([classes.input__input, inputClassName, 'fa'])}
            {...rest}
          />
          {suffix && <div className={classes.input__suffix}>{suffix}</div>}
          {suffixIcon && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleClick()}
              onKeyDown={() => handleClick()}
              className={classes['input__suffix-icon']}
            >
              {suffixIcon}
            </div>
          )}
          {suffixAction && <div className={classes['input__suffix-action']}>{suffixAction}</div>}
        </div>

        {showCaption && <p className={classes.input__caption}>{caption}</p>}
      </div>
    )
  }
)

Input.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  ltr: PropTypes.bool,
  className: PropTypes.string,
  convertNumbers: PropTypes.bool,
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  success: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isNumeric: PropTypes.bool,
  multiline: PropTypes.bool,
  readOnly: PropTypes.bool,
  readOnlyInput: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  suffix: PropTypes.node,
  suffixIcon: PropTypes.node,
  suffixAction: PropTypes.node,
  horizontalMode: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inputClassName: PropTypes.string,
  helperText: PropTypes.node,
  floatError: PropTypes.bool,
}

Input.displayName = 'Input'

export default Input
