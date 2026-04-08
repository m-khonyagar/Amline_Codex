/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import SelectUser from './SelectUser'
import { Field } from '@/components/ui/Form'

function SelectUserField({
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
      render={({ field: { ref, ...field }, fieldState }) => (
        <SelectUser error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

SelectUserField.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...SelectUser.propTypes,
}

export default SelectUserField
