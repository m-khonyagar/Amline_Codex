'use client'

import React from 'react'
import { NumericFormat, type NumberFormatValues } from 'react-number-format'
import { Input } from './input'

export interface InputNumberProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange'
  > {
  className?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  type?: 'text' | 'tel' | 'password'
  value?: number | string
  defaultValue?: number | string
  onValueChange?: (numericValue: number | undefined, rawValue: string) => void
  allowLeadingZeros?: boolean
  allowNegative?: boolean
  allowDecimal?: boolean
  thousandSeparator?: string
  decimalSeparator?: string
  decimalScale?: number
  prefix?: string
  suffix?: string
  min?: number
  max?: number
}

export const InputNumber = ({
  leftIcon,
  rightIcon,
  onValueChange,
  allowNegative = false,
  allowDecimal = false,
  decimalScale,
  decimalSeparator = '.',
  thousandSeparator = ',',
  min,
  max,
  ...props
}: InputNumberProps) => {
  const allowDecimalScale = allowDecimal ? decimalScale : 0

  const handleValueChange = (values: NumberFormatValues) => {
    onValueChange?.(values.floatValue, values.formattedValue)
  }

  return (
    <NumericFormat
      customInput={Input}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      onValueChange={handleValueChange}
      allowNegative={allowNegative}
      decimalSeparator={decimalSeparator}
      decimalScale={allowDecimalScale}
      thousandSeparator={thousandSeparator}
      isAllowed={vals => {
        if (vals.floatValue == null) return true
        if (typeof min === 'number' && vals.floatValue < min) return false
        if (typeof max === 'number' && vals.floatValue > max) return false
        return true
      }}
      {...props}
    />
  )
}
