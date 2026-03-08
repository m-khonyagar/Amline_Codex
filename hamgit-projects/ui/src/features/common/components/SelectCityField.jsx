import PropTypes from 'prop-types'
import SelectCity from './SelectCity'
import { Field } from '@/components/ui/Form'

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
      render={({ field: { _ref, ...field }, fieldState }) => (
        <SelectCity error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

SelectField.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...SelectCity.propTypes,
}

export default SelectField
