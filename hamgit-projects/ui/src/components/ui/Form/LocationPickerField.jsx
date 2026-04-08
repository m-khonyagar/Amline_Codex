import PropTypes from 'prop-types'
import Field from './Field'
import { NextLocationPickerInput } from '../Location'

function LocationPickerField({
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
        <NextLocationPickerInput error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

LocationPickerField.propTypes = {
  defaultValue: PropTypes.arrayOf(PropTypes.number),
  id: PropTypes.string,
  name: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...NextLocationPickerInput.propTypes,
}

export default LocationPickerField
