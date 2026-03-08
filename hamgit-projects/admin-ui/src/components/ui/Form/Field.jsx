import { useId } from 'react'
import { useController } from 'react-hook-form'

function Field({
  id,
  name,
  render,
  control,
  pattern,
  required,
  defaultValue,
  shouldUnregister = false,
}) {
  const { field, fieldState, formState } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
    rules: {
      pattern,
      required: required === true ? 'این گزینه اجباریه' : required,
    },
  })

  const defaultId = useId()
  const inputId = !id ? defaultId : id

  const localField = {
    id: inputId,
    ...field,
  }

  return render({ field: localField, fieldState, formState })
}

export default Field
