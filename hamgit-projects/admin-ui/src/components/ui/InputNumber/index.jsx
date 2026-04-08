import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { NumberFormatBase, useNumericFormat } from 'react-number-format'

import Input from '../Input'

const InputNumber = forwardRef(
  (
    {
      decimalScale,
      suffix,
      type = 'tel',
      allowLeadingZeros,
      decimalSeparator = '.',
      thousandSeparator = ',',
      allowNegative = false,
      ...props
    },
    ref
  ) => {
    const _props = useNumericFormat({
      decimalScale,
      allowNegative,
      decimalSeparator,
      allowLeadingZeros,
      thousandSeparator,
      ...props,
    })

    return (
      <NumberFormatBase
        suffix={suffix}
        getInputRef={ref}
        type={type}
        customInput={Input}
        inputClassName={props.className}
        convertNumbers
        {..._props}
      />
    )
  }
)

InputNumber.displayName = 'InputNumber'

InputNumber.propTypes = {
  allowLeadingZeros: PropTypes.bool,
  decimalScale: PropTypes.number,
  decimalSeparator: PropTypes.string,
  thousandSeparator: PropTypes.string,
  type: PropTypes.string,
  ...Input.propTypes,
}

export default InputNumber
