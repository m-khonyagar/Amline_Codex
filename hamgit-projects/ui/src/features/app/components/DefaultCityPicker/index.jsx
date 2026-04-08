import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import PropTypes from 'prop-types'
import { cn } from '@/utils/dom'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import {
  CheckboxCheckBoldIcon,
  CheckboxIcon,
  ChevronLeftIcon,
  CircleLoadingIcon,
  CloseIcon,
  SearchIcon,
} from '@/components/icons'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DrawerModal from '@/components/ui/DrawerModal'
import { useGetProvinceCities, useGetProvinces } from '@/features/common'
import { toast } from '@/components/ui/Toaster'
import { useAppContext } from '@/features/app'
import classes from './Select.module.scss'

export default function DefaultCityPicker() {
  const { defaultCities, setDefaultCities, isOpen, setIsOpen } = useAppContext()

  const [step, setStep] = useState('province-select')
  const [provinceValue, setProvinceValue] = useState(defaultCities?.province)
  const [cities, setCities] = useState([])

  const provincesQuery = useGetProvinces()
  const provinceCitiesQuery = useGetProvinceCities(provinceValue, { enabled: !!provinceValue })

  const options = useMemo(() => provincesQuery.data || [], [provincesQuery.data])
  const cityOptions = useMemo(() => provinceCitiesQuery.data || [], [provinceCitiesQuery.data])
  const provinceObject = useMemo(
    () => options.find((i) => i.id === provinceValue),
    [provinceValue, options]
  )

  const closeModal = () => {
    if (!defaultCities?.cities.length) return toast.error('حداقل یک شهر را انتخاب کن!')
    setCities(defaultCities?.cities)
    return setIsOpen(false)
  }

  const handleProvinceSelect = (val) => {
    setProvinceValue(val)
    setStep('city-select')
  }

  const handleCitiesSelect = (val) => {
    setCities(val)
  }

  const handleBackToProvinceSelect = () => {
    setStep('province-select')
    setCities([])
  }

  useEffect(() => {
    if (defaultCities?.province) {
      setProvinceValue(defaultCities.province)
      setCities(defaultCities.cities)
      setStep('city-select')
    }
  }, [defaultCities])

  return (
    <DrawerModal
      show={isOpen}
      modalHeader="شهر پیش فرض"
      handleClose={closeModal}
      dismissible={!!cities.length}
      className={cn(classes['bottom-sheet'], 'bottom-sheet--fixed-search', {
        'mb-[66px]': step === 'city-select',
      })}
    >
      {step === 'province-select' && (
        <Select
          asValue
          searchable
          valueKey="id"
          labelKey="name"
          options={options}
          value={provinceValue}
          onChange={handleProvinceSelect}
          loading={provincesQuery.isLoading}
        />
      )}
      {step === 'city-select' && (
        <>
          <Select
            asValue
            searchable
            valueKey="id"
            labelKey="name"
            options={cityOptions}
            value={cities}
            onChange={handleCitiesSelect}
            loading={provinceCitiesQuery.isLoading}
            multiSelect
            selectAllLabel={`همه شهر های ${provinceObject?.name}`}
            className="pb-4"
            child={
              <div
                tabIndex={0}
                role="button"
                aria-hidden="true"
                className={cn(classes['bottom-sheet__option'], 'font-semibold mt-6')}
                onClick={handleBackToProvinceSelect}
              >
                استان ها
                <ChevronLeftIcon className={classes['bottom-sheet__option__chevron-left']} />
              </div>
            }
          />

          <div className="fixed left-0 right-0 bottom-0 px-6 py-5 bg-white">
            <Button
              onClick={() => {
                setDefaultCities({
                  cities,
                  province: provinceValue,
                  city_name: cityOptions.find((i) => i.id === cities[0]).name,
                })
                setIsOpen(false)
              }}
              disabled={!cities.length}
              className="w-full"
            >
              ذخیره و ادامه
            </Button>
            <span className={classes['btn-shadow']} />
          </div>
        </>
      )}
    </DrawerModal>
  )
}

function Select({
  child,
  value,
  asValue,
  loading,
  onSearch,
  className,
  multiSelect,
  defaultValue,
  options = [],
  labelKey = 'label',
  valueKey = 'value',
  disabledKey = 'disabled',
  searchable = false,
  onChange = () => undefined,
  searchInputPlaceholder = 'جست‌وجو',
  selectAllLabel = 'انتخاب همه',
}) {
  const [searchText, setSearchText] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [isPending, startTransition] = useTransition()

  const [localValue, setLocalValue] = useUncontrolled({
    value,
    onChange,
    defaultValue,
    finalValue: [],
  })

  const selectedOptions = useMemo(() => {
    const _values = Array.isArray(localValue)
      ? localValue
      : [localValue].filter((v) => v !== null && v !== undefined)

    if (asValue) {
      return options.filter((o) => _values.includes(o[valueKey]))
    }
    return _values
  }, [asValue, localValue, options, valueKey])

  const selectedValues = useMemo(() => {
    return selectedOptions.map((o) => o[valueKey])
  }, [selectedOptions, valueKey])

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value)
    onSearch?.()
  }

  const handleClearSearchInput = () => {
    setSearchText('')
  }

  const removeOption = (option) => {
    if (asValue) {
      setLocalValue(localValue.filter((v) => v !== option[valueKey]))
    } else {
      setLocalValue(localValue.filter((o) => o[valueKey] !== option[valueKey]))
    }
  }

  const removeAllOption = () => {
    setLocalValue([])
  }

  const handleSelect = (option) => {
    const _option = asValue ? option[valueKey] : option

    if (!multiSelect) {
      setLocalValue(_option)
      return
    }

    if (!Array.isArray(localValue)) {
      setLocalValue([option])
      return
    }

    const isBeforeSelected = asValue
      ? localValue.find((o) => o === option[valueKey])
      : localValue.find((o) => o[valueKey] === option[valueKey])

    if (isBeforeSelected) {
      removeOption(option)
    } else {
      setLocalValue([...localValue, _option])
    }
  }

  const isOptionSelected = (option) => {
    return selectedValues.includes(option[valueKey])
  }

  useEffect(() => {
    if (searchable) {
      startTransition(() => {
        setFilteredOptions(
          options.filter((option) =>
            option[labelKey].toLowerCase().includes(searchText.toLowerCase())
          )
        )
      })
    } else {
      setFilteredOptions(options)
    }
  }, [labelKey, options, searchText, searchable])

  const isAllOptionsSelected = () => {
    return !options.some((i) => !selectedValues.includes(i.id))
  }

  const handleSelectAll = () => {
    const _options = asValue ? options.map((i) => i[valueKey]) : options
    if (isAllOptionsSelected()) {
      setLocalValue([])
    } else {
      setLocalValue(_options)
    }
  }
  return (
    <div className={cn(classes.select, className)}>
      {loading ? (
        <div className={classes['bottom-sheet__loading']}>
          <CircleLoadingIcon className="animate-spin" size={28} />
          در حال بارگذاری
        </div>
      ) : (
        <>
          {searchable && (
            <Input
              value={searchText}
              suffixIcon={
                // eslint-disable-next-line no-nested-ternary
                isPending ? (
                  <CircleLoadingIcon className="animate-spin" />
                ) : searchText ? (
                  <CloseIcon onClick={() => handleClearSearchInput()} />
                ) : (
                  <SearchIcon />
                )
              }
              onChange={handleSearchInputChange}
              placeholder={searchInputPlaceholder}
              className={classes['bottom-sheet__search-input']}
            />
          )}
          {multiSelect && (
            <div className="flex items-center gap-2 h-[25px]">
              <div className={classes['selected-options']}>
                {selectedOptions.map((o) => (
                  <div key={o[valueKey]} className={classes['selected-options__item']}>
                    {o[labelKey]}{' '}
                    <button type="button" aria-label="remove" onClick={() => removeOption(o)}>
                      <CloseIcon size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {!!selectedOptions.length && (
                <button
                  type="button"
                  className={classes['selected-remove-all']}
                  onClick={removeAllOption}
                >
                  حذف همه
                </button>
              )}
            </div>
          )}
          {child}
          <div className={cn(classes['bottom-sheet__options'], 'fa', { 'opacity-50': isPending })}>
            {filteredOptions.length > 0 ? (
              <>
                {multiSelect && (
                  <OptionItem
                    label={selectAllLabel}
                    multiSelect
                    onClick={handleSelectAll}
                    isSelected={isAllOptionsSelected()}
                  />
                )}
                {filteredOptions.map((option) => (
                  <OptionItem
                    key={option[valueKey]}
                    label={option[labelKey]}
                    multiSelect={multiSelect}
                    disabled={option[disabledKey]}
                    onClick={() => handleSelect(option)}
                    isSelected={isOptionSelected(option)}
                  />
                ))}
              </>
            ) : (
              <div className={classes['bottom-sheet__no-option']}>
                نتیجه‌ای برای جستجوی شما پیدا نشد.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function OptionItem({ label, multiSelect, onClick, isSelected, disabled }) {
  let CheckIconComp = null
  const clientY = useRef()

  if (multiSelect) {
    CheckIconComp = isSelected ? CheckboxCheckBoldIcon : CheckboxIcon
  }

  const handleMouseUp = (e) => {
    if (disabled) return

    if (e.clientY < clientY.current + 5 && e.clientY > clientY.current - 5) {
      onClick(e)
    }
  }

  const handleMouseDown = (e) => {
    if (disabled) return

    clientY.current = e.clientY
  }

  const handleKeyDown = (e) => {
    if (disabled) return

    if (e.key === 'Enter') {
      onClick(e)
    }
  }

  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={handleKeyDown}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      className={cn(classes['bottom-sheet__option'], {
        [classes['bottom-sheet__option--multiselect']]: isSelected,
        [classes['bottom-sheet__option--selected']]: isSelected,
        [classes['bottom-sheet__option--disabled']]: disabled,
      })}
    >
      {label}

      {multiSelect ? (
        <CheckIconComp className={classes['bottom-sheet__option__checkbox']} />
      ) : (
        <ChevronLeftIcon className={classes['bottom-sheet__option__chevron-left']} />
      )}
    </div>
  )
}

Select.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  labelKey: PropTypes.string,
  multiSelect: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  searchInputPlaceholder: PropTypes.string,
  searchable: PropTypes.bool,
  asValue: PropTypes.bool,
  // value: PropTypes.any,
  // defaultValue: PropTypes.object,
  valueKey: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ),
}
