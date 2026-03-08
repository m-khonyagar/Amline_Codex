import PropTypes from 'prop-types'
import Field from './Field'
import ImageUploader from '../ImageUploader'

function ImageUploaderField({
  id,
  name,
  control,
  getValues,
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
      getValues={getValues}
      required={required}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        return (
          <ImageUploader
            error={fieldState.error?.message}
            {...props}
            {...field}
            onChange={(v) => {
              const newValue =
                typeof v === 'function' && getValues() !== undefined ? v(getValues(name)) : v
              field.onChange(newValue)
            }}
          />
        )
      }}
    />
  )
}

ImageUploaderField.propTypes = {
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.node,
  name: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  ...ImageUploader.propTypes,
}

export default ImageUploaderField
