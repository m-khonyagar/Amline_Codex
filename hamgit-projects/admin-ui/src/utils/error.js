import { PRContractStepOptions } from '@/data/enums/prcontract-enums'
import get from 'lodash/get'
import has from 'lodash/has'
import { translateEnum } from './enum'
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
    const message =
      error?.response?.message ||
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      'خطایی رخ داد، لطفا مجددا تلاش نمایید'

    const extraMessage = error?.response?.data?.location
      ? error.response.data.location
          .map((item) => translateEnum(PRContractStepOptions, item))
          .join(', ')
      : null

    toast.error(message, { description: extraMessage })

    console.error('error in form submission:', error)
  }
}

const handleErrorPage = (error) => {
  // for now
  if (error.code === 404) {
    throw error
  }
}

const handleMissingStepError = (error) => {
  // handleErrorOnSubmit(error)
  const location = error?.response?.data?.location
  if (location.length === 0) return
  const message = location.map((item) => translateEnum(PRContractStepOptions, item)).join(', ')
  toast.error(message)
  // toast.error({
  //   title: 'ناقص بودن مراحل',
  //   message,
  //   color: 'red',
  // })
}

export { handleErrorOnSubmit, handleErrorPage, handleMissingStepError }
