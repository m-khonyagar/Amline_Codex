import { useWatch } from 'react-hook-form'

/**
 * get form values
 * @param {import('react-hook-form').UseFormReturn} methods
 */
const useFormValues = (methods) => {
  return {
    ...useWatch({ control: methods.control }), // subscribe to form value updates

    ...methods.getValues(), // always merge with latest form values
  }
}

export default useFormValues
