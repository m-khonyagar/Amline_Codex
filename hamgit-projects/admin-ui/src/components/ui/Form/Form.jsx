import { FormProvider } from 'react-hook-form'

function Form({ methods, onSubmit, className, children }) {
  const { handleSubmit } = methods

  const handleFormSubmit = (e) => {
    if (typeof e.stopPropagation === 'function') e.stopPropagation()
    return handleSubmit((data) => onSubmit(data, methods))(e)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className={className}>
        {children}
      </form>
    </FormProvider>
  )
}

export default Form
