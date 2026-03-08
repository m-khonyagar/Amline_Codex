import PropTypes from 'prop-types'
import Input from '../Input'
import Field from './Field'

function InputField({
  id,
  name,
  control,
  pattern,
  required,
  defaultValue,
  shouldUnregister = false,
  minLength,
  maxLength,
  ...props
}) {
  return (
    <Field
      id={id}
      name={name}
      control={control}
      pattern={pattern}
      required={required}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      minLength={minLength}
      maxLength={maxLength}
      render={({ field, fieldState }) => (
        <Input
          error={fieldState.error?.message}
          minLength={minLength}
          maxLength={maxLength}
          {...props}
          {...field}
        />
      )}
    />
  )
}

InputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  ...Input.propTypes,
}

export default InputField
