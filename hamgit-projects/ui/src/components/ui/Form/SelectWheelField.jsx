import PropTypes from 'prop-types'
import Field from './Field'
import SelectWheelInput from '../SelectWheelInput'

function SelectWheelField({
  id,
  name,
  control,
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
      required={required}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => (
        <SelectWheelInput error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

SelectWheelField.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...SelectWheelInput.propTypes,
}

export default SelectWheelField
