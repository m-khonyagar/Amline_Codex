import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { NumberFormatBase, useNumericFormat } from 'react-number-format'

import Input from '../Input'

const InputNumber = forwardRef(
  (
    {
      decimalScale,
      type = 'tel',
      allowLeadingZeros,
      decimalSeparator = '.',
      thousandSeparator = ',',
      allowNegative = false,
      ...props
    },
    ref
  ) => {
    const { suffix, ...rest } = props

    const _props = useNumericFormat({
      decimalScale,
      allowNegative,
      decimalSeparator,
      allowLeadingZeros,
      thousandSeparator,
      ...rest,
    })

    return (
      <NumberFormatBase
        suffix={suffix}
        getInputRef={ref}
        type={type}
        customInput={Input}
        convertNumbers
        {..._props}
      />
    )
  }
)

InputNumber.propTypes = {
  allowLeadingZeros: PropTypes.bool,
  decimalScale: PropTypes.number,
  decimalSeparator: PropTypes.string,
  thousandSeparator: PropTypes.string,
  type: PropTypes.string,
  ...Input.propTypes,
}

export default InputNumber
