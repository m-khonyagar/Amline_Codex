import { useState } from 'react'
import { useUpdateEffect } from '@/hooks/use-update-effect'
import { useDebounce } from '@/hooks/use-debounce'
import Input from '../Input'
import { CloseIcon, SearchIcon } from '@/components/icons'

const SearchInput = ({ onSubmit, initialValue, delay = 350, ...props }) => {
  const [value, setValue] = useState(initialValue || '')
  const debouncedValue = useDebounce(value, delay)

  useUpdateEffect(() => {
    onSubmit?.(debouncedValue)
  }, [debouncedValue])

  return (
    <Input
      value={value}
      placeholder="جستجو"
      convertNumbers
      floatError
      onChange={(e) => setValue(e.target.value)}
      suffixAction={
        value ? (
          <button type="button" onClick={() => setValue('')}>
            <CloseIcon size={24} className="text-gray-400 ml-2" />
          </button>
        ) : (
          <SearchIcon size={24} className="text-gray-300 ml-2" />
        )
      }
      {...props}
    />
  )
}

export default SearchInput
