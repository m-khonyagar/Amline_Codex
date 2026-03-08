import PropTypes from 'prop-types'
import Field from './Field'
import ImageUploader from '../ImageUploader'

function ImageUploaderField({
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
        <ImageUploader ref={ref} error={fieldState.error?.message} {...props} {...field} />
      )}
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
