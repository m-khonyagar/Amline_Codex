import PropTypes from 'prop-types'
import Field from './Field'
import DateTimePicker from '@/components/ui/DateTimePicker.jsx'

function DateTimePickerField({
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
        <DateTimePicker error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

DateTimePickerField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  shouldUnregister: PropTypes.bool,
}

export default DateTimePickerField
