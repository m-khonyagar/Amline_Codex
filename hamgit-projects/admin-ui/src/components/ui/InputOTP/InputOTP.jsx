import cx from 'clsx'
import { createRef, forwardRef, useEffect, useState } from 'react'
import classes from './InputOTP.module.scss'
import Input from '../Input'

const isNumber = (v) => /^[0-9]+$/.test(v)

const InputOTP = forwardRef(
  (
    {
      value,
      error,
      success,
      disabled,
      onChange,
      validate,
      autoFocus,
      className,
      onComplete,
      length = 5,
      type = 'tel',
      placeholder = '',
      autoComplete = true,
    },
    ref
  ) => {
    const validateFn = ['tel', 'number'].includes(type) && !validate ? isNumber : validate

    const [inputs, setInputs] = useState(
      Array.from({ length }, (_, i) => ({
        value: value?.[i] || '',
        ref: createRef(),
      }))
    )

    const focusInputByIndex = (i) => {
      inputs[i]?.ref.current?.focus()
    }

    const selectInputByIndex = (i) => {
      inputs[i]?.ref.current?.select()
    }

    const getMergedValue = (ins) => ins.map((i) => i.value).join('')

    const handleChange = (e, i) => {
      const inputValue = e.target.value
      const nextChar =
        inputValue.length > 1 ? inputValue.split('')[inputValue.length - 1] : inputValue

      if (typeof validateFn === 'function' && !validateFn(nextChar, i)) {
        return
      }

      const newInputs = inputs.map((item, index) =>
        index === i ? { ...item, value: nextChar } : item
      )

      const mergedValue = getMergedValue(newInputs)

      setInputs(newInputs)

      onChange?.(mergedValue)

      if (mergedValue.length === length) {
        onComplete?.(mergedValue)
      }

      if (nextChar !== '') {
        selectInputByIndex(i + 1)
      } else if (i > 0) {
        selectInputByIndex(i - 1)
      }
    }

    const handleKeyDown = (e, i) => {
      if (e.target.value === e.key) {
        e.preventDefault()
        selectInputByIndex(i + 1)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        if (e.target.value !== '') {
          const newInputs = inputs.map((item, index) =>
            index === i ? { ...item, value: '' } : item
          )
          setInputs(newInputs)
          onChange?.(getMergedValue(newInputs))
        }
        selectInputByIndex(i - 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        selectInputByIndex(i - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        selectInputByIndex(i + 1)
      }
    }

    const handlePaste = (e, i) => {
      e.preventDefault()

      const content = e.clipboardData.getData('text/plain')

      if (typeof validateFn === 'function' && !validateFn(content, i)) return
      const code = content.split('')

      const newInputs = inputs.map((item, index) =>
        index >= i && code[index - i] !== undefined ? { ...item, value: code[index - i] } : item
      )

      const mergedValue = getMergedValue(newInputs)
      setInputs(newInputs)
      onChange?.(mergedValue)

      if (mergedValue.length === length) {
        onComplete?.(mergedValue)
        focusInputByIndex(length - 1)
      } else {
        const emptyIndex = newInputs.findIndex((item) => item.value === '')
        if (emptyIndex !== -1) focusInputByIndex(emptyIndex)
      }
    }

    const handleFocus = (e, i) => {
      selectInputByIndex(i)
      e.preventDefault()
    }

    useEffect(() => {
      focusInputByIndex(0)

      if (autoComplete && 'OTPCredential' in window) {
        const ac = new AbortController()

        navigator.credentials
          .get({
            otp: { transport: ['sms'] },
            signal: ac.signal,
          })
          .then((otp) => {
            if (!otp?.code) {
              console.error('No code in OTP response')
              return
            }

            const code = otp.code.split('')

            if (code.length !== length) {
              console.error(`Code length mismatch. Expected ${length}, got ${code.length}`)
              return
            }

            const newInputs = inputs.map((item, index) => ({
              ...item,
              value: code[index] || '',
            }))

            const mergedValue = getMergedValue(newInputs)
            setInputs(newInputs)
            onChange?.(mergedValue)

            if (mergedValue.length === length) {
              onComplete?.(mergedValue)
            }
          })
          .catch((e) => {
            console.error('OTP Error:', e)
          })

        setTimeout(() => ac.abort(), 60 * 1000)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div className={cx(classes.wrapper, className)} ref={ref}>
        {inputs.map((input, i) => (
          <Input
            key={i}
            floatError
            type={type}
            convertNumbers
            error={!!error}
            ref={input.ref}
            success={!!success}
            value={input.value}
            disabled={disabled}
            placeholder={placeholder}
            className={classes.input}
            autoFocus={autoFocus && i === 0}
            autoComplete="one-time-code"
            onPaste={(e) => handlePaste(e, i)}
            onFocus={(e) => handleFocus(e, i)}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>
    )
  }
)

InputOTP.displayName = 'InputOTP'

export default InputOTP
