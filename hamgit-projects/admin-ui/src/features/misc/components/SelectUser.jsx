import Select from '@/components/ui/Select'
import { useGetUsers } from '@/features/user'
import { useDebounce } from '@/hooks/use-debounce'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { useMemo, useState } from 'react'

const SelectUser = ({ value, onChange, defaultValue, ...props }) => {
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce(keyword, 350)

  const [localValue, setLocalValue] = useUncontrolled({
    value,
    onChange,
    defaultValue,
  })

  const usersQuery = useGetUsers({ search_text: debouncedValue.trim() || null })

  const handleChange = (option) => {
    setLocalValue(option)
  }

  const options = useMemo(() => usersQuery.data?.data || [], [usersQuery.data])

  return (
    <Select
      searchable
      asValue
      valueKey="id"
      labelKey="mobile"
      label="انتخاب کاربر"
      options={options}
      value={localValue}
      onChange={handleChange}
      loading={usersQuery.isFetching}
      onSearch={(v) => setKeyword(v)}
      {...props}
    />
  )
}

export default SelectUser
