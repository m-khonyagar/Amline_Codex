import PropTypes from 'prop-types'
import InputNumber from '../InputNumber'
import Field from './Field'

function InputNumberField({
  id,
  name,
  required,
  pattern,
  control,
  defaultValue,
  shouldUnregister = false,
  ...props
}) {
  return (
    <Field
      id={id}
      name={name}
      control={control}
      required={required}
      pattern={pattern}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, ...field }, fieldState }) => (
        <InputNumber
          error={fieldState.error?.message}
          onValueChange={({ value }) =>
            onChange({
              target: {
                value,
                name,
              },
              type: 'change',
            })
          }
          {...props}
          {...field}
        />
      )}
    />
  )
}

InputNumberField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...InputNumber.propTypes,
}

export default InputNumberField
