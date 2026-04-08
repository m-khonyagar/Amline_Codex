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
      render={({ field, fieldState }) => (
        <Input error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

InputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...Input.propTypes,
}

export default InputField
