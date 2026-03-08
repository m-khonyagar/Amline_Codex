import PropTypes from 'prop-types'
import InputNumber from '../InputNumber'
import Field from './Field'

function InputNumberField({
  id,
  name,
  required,
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
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, ...field }, fieldState }) => (
        <InputNumber
          error={fieldState.error?.message}
          onValueChange={({ value }) =>
            onChange({
              target: {
                value:
                  value === '' || value === null || value === undefined ? undefined : Number(value),
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
  defaultValue: PropTypes.number,
  shouldUnregister: PropTypes.bool,
  ...InputNumber.propTypes,
}

export default InputNumberField
