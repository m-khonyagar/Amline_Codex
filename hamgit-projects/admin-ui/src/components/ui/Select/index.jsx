import PropTypes from 'prop-types'
import * as SelectPrimitive from '@radix-ui/react-select'
import { forwardRef, useEffect, useMemo, useRef, useState, useTransition } from 'react'

import Input from '../Input'
import { cn } from '@/utils/dom'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import {
  CheckboxCheckBoldIcon,
  CheckboxIcon,
  ChevronDownIcon,
  // ChevronUpIcon,
  CircleLoadingIcon,
  CloseIcon,
  SearchIcon,
} from '@/components/icons'

import classes from './Select.module.scss'
// import DrawerModal from '../DrawerModal'

const Select = forwardRef(
  (
    {
      child,
      label,
      value,
      onOpen,
      error,
      asValue,
      onClose,
      loading,
      disabled,
      onSearch,
      className,
      helperText,
      floatError = false,
      // modalTitle,
      multiSelect,
      defaultValue,
      options = [],
      inputClassName = 'text-right',
      wrapperClassName,
      labelKey = 'label',
      valueKey = 'value',
      disabledKey = 'disabled',
      searchable = false,
      fixedSearch = true,
      horizontalMode = false,
      onChange = () => {},
      placeholder = 'انتخاب کنید',
      searchInputPlaceholder = 'جست‌وجو',
      // renderer callbacks
      renderOption,
      renderSelected,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
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

    const localPlaceholder = useMemo(() => {
      if (!multiSelect) return placeholder

      return selectedOptions.length > 0 ? `${selectedOptions.length} مورد انتخاب شده` : placeholder
    }, [multiSelect, placeholder, selectedOptions.length])

    const onClickInput = () => {
      if (disabled) return
      setIsOpen(true)
      onOpen?.()
    }

    const closeModal = () => {
      setIsOpen(false)
      onClose?.()
    }

    const inputValue = useMemo(() => {
      if (multiSelect) return ''

      const selectedOption = options.find((o) => o[valueKey] === selectedValues[0])
      return selectedOption ? selectedOption[labelKey] : ''
    }, [multiSelect, options, valueKey, selectedValues, labelKey])

    const handleSearchInputChange = (e) => {
      setSearchText(e.target.value)
      onSearch?.(e.target.value)
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

    const handleSelect = (option) => {
      const _option = asValue ? option[valueKey] : option

      if (!multiSelect) {
        setLocalValue(_option)
        closeModal()
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

    return (
      <div className={cn(classes.select, className)}>
        <SelectPrimitive.Root open={isOpen} onOpenChange={(s) => setIsOpen(s)}>
          <SelectPrimitive.Trigger asChild dir="rtl" className="text-right">
            <Input
              readOnlyInput
              ref={ref}
              type="text"
              error={error}
              label={label}
              value={inputValue}
              disabled={disabled}
              onClick={onClickInput}
              floatError={floatError}
              helperText={helperText}
              inputClassName={inputClassName}
              wrapperClassName={wrapperClassName}
              placeholder={localPlaceholder}
              horizontalMode={horizontalMode}
              suffixIcon={
                loading ? (
                  <CircleLoadingIcon className="animate-spin" />
                ) : horizontalMode ? null : (
                  <ChevronDownIcon />
                )
              }
            />
          </SelectPrimitive.Trigger>

          {multiSelect && selectedOptions.length > 0 && (
            <div className={classes['selected-options']}>
              {selectedOptions.map((o) => (
                <div key={o[valueKey]} className={classes['selected-options__item']}>
                  {typeof renderSelected === 'function' ? (
                    renderSelected(o, { remove: () => removeOption(o) })
                  ) : (
                    <>
                      {o[labelKey]}{' '}
                      <button type="button" aria-label="remove" onClick={() => removeOption(o)}>
                        <CloseIcon size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              dir="rtl"
              className={cn(
                'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
              )}
              position="popper"
            >
              {/* <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                <ChevronUpIcon size={16} />
              </SelectPrimitive.ScrollUpButton> */}
              <SelectPrimitive.Viewport
                className={cn(
                  'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
                  classes['bottom-sheet'],
                  {
                    [classes['bottom-sheet--fixed-search']]: fixedSearch,
                  }
                )}
              >
                {searchable && (
                  <Input
                    autoFocus
                    value={searchText}
                    suffixIcon={
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
                {loading ? (
                  <div className={classes['bottom-sheet__loading']}>
                    <CircleLoadingIcon className="animate-spin" size={28} />
                    در حال بارگذاری
                  </div>
                ) : (
                  <>
                    {child}
                    <div
                      className={cn(classes['bottom-sheet__options'], 'fa', {
                        'opacity-50': isPending,
                      })}
                    >
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <OptionItem
                            key={option[valueKey]}
                            label={
                              typeof renderOption === 'function'
                                ? renderOption(option, { isSelected: isOptionSelected(option) })
                                : option[labelKey]
                            }
                            multiSelect={multiSelect}
                            disabled={option[disabledKey]}
                            onClick={() => handleSelect(option)}
                            isSelected={isOptionSelected(option)}
                          />
                        ))
                      ) : (
                        <div className={classes['bottom-sheet__no-option']}>
                          نتیجه‌ای برای جستجوی شما پیدا نشد.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </SelectPrimitive.Viewport>
              <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                <ChevronDownIcon size={16} />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>
    )
  }
)

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
      {multiSelect && <CheckIconComp className={classes['bottom-sheet__option__checkbox']} />}

      {label}
    </div>
  )
}

Select.displayName = 'Select'

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  inputClassName: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  labelKey: PropTypes.string,
  modalTitle: PropTypes.string,
  multiSelect: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  searchInputPlaceholder: PropTypes.string,
  searchable: PropTypes.bool,
  helperText: PropTypes.node,
  floatError: PropTypes.bool,
  asValue: PropTypes.bool,
  horizontalMode: PropTypes.bool,
  // value: PropTypes.any,
  // defaultValue: PropTypes.object,
  valueKey: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      label: PropTypes.string,
    })
  ),
  renderOption: PropTypes.func,
  renderSelected: PropTypes.func,
}

export default Select
