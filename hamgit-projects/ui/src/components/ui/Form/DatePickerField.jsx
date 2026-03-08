import PropTypes from 'prop-types'
import Field from './Field'
import DatePickerInput from '../DatePickerInput'

function DatePickerField({
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
      render={({ field: { _ref, ...field }, fieldState }) => (
        <DatePickerInput error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

DatePickerField.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...DatePickerInput.propTypes,
}

export default DatePickerField
