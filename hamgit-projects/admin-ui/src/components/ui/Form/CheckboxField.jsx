import PropTypes from 'prop-types'
import Field from './Field'
import Checkbox from '../Checkbox'

function CheckboxField({ id, name, control, defaultValue, shouldUnregister = false, ...props }) {
  return (
    <Field
      id={id}
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => (
        <Checkbox checked={!!field.value} error={fieldState.error?.message} {...props} {...field} />
      )}
    />
  )
}

CheckboxField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...Checkbox.propTypes,
}

export default CheckboxField
