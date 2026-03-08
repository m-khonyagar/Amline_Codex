import PropTypes from 'prop-types'
import Field from './Field'
import Select from '../Select'

function SelectField({
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
        <Select error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

SelectField.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...Select.propTypes,
}

export default SelectField
