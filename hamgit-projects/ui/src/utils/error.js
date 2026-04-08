/* eslint-disable prettier/prettier */
import has from 'lodash/has'
import get from 'lodash/get'

import { toast } from '@/components/ui/Toaster'

const handleErrorOnSubmit = (error, setError, data, dataAliases = {}) => {
  let unknown = false
  const fieldErrors = error?.response?.data?.data || error?.response?.data?.errors

  try {
    if (
      [400, 422].includes(error?.response?.status) &&
      Array.isArray(fieldErrors) &&
      setError &&
      data
    ) {
      fieldErrors.forEach((fieldError) => {
        const location = fieldError.loc.filter((l) => l !== 'body')

        if (has(data, location)) {
          setError(location.join('.'), { type: 'api', message: fieldError.msg })
        } else if (has(dataAliases, location)) {
          setError(get(dataAliases, location.join('.')), {
            type: 'api',
            message: fieldError.msg,
          })
        } else {
          unknown = true
        }
      })
    } else {
      unknown = true
    }
  } catch (e) {
    unknown = true
    console.error(e)
  }

  if (unknown) {
    // setError('unknown', {
    //   type: 'api',
    //   message: error?.response?.data?.message || 'Something went wrong.',
    // })
    toast.error(
      error?.response?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'خطایی رخ داد، لطفا مجددا تلاش نمایید'
    )
    console.error('error in form submission:', error)
  }
}

const handleErrorPage = (error) => {
  // for now
  if (error.code === 404) {
    throw error
  }
}

export { handleErrorOnSubmit, handleErrorPage }
