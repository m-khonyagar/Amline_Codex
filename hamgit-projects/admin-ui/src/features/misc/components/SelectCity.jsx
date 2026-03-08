import { useMemo } from 'react'
import Select from '@/components/ui/Select'
import useGetCities from '../api/get-cities'
import { useUncontrolled } from '@/hooks/use-uncontrolled'

function SelectCity({ value, onChange, defaultValue, ...props }) {
  const [localValue, setLocalValue] = useUncontrolled({
    value,
    onChange,
    defaultValue,
  })

  const citiesQuery = useGetCities()

  const handleChange = (option) => {
    setLocalValue(option)
  }

  const options = useMemo(() => citiesQuery.data || [], [citiesQuery.data])

  return (
    <div>
      <Select
        searchable
        asValue
        valueKey="id"
        labelKey="full_name"
        modalTitle="شهر"
        options={options}
        value={localValue}
        onChange={handleChange}
        loading={citiesQuery.isLoading}
        {...props}
      />
    </div>
  )
}

export default SelectCity
