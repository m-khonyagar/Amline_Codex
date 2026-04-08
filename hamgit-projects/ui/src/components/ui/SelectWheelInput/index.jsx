import { useState, forwardRef, useMemo } from 'react'
import { CalendarIcon } from '@/components/icons'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import Input from '../Input'
import Button from '../Button'
import DrawerModal from '../DrawerModal'
import { WheelPicker } from '../DatePicker'

const SelectWheelInput = forwardRef(
  (
    {
      label,
      value,
      onChange,
      formatFn,
      defaultValue,
      pickerSuffix = '',
      options = [],
      labelKey = 'label',
      valueKey = 'value',
      ...props
    },
    ref
  ) => {
    const [isShow, setIsShow] = useState(false)
    const [tempValue, setTempValue] = useState(
      // eslint-disable-next-line no-nested-ternary
      value === undefined ? (defaultValue === undefined ? options?.[0] : defaultValue) : value
    )

    const [localValue, setLocalValue] = useUncontrolled({
      value,
      onChange,
      defaultValue,
    })

    const startIndex = useMemo(() => {
      return options.findIndex((option) => option[valueKey] === localValue?.[valueKey])
    }, [localValue, options, valueKey])

    const formatValue = (v) => {
      if (!v) return ''

      if (typeof formatFn === 'function') {
        return formatFn(v)
      }

      return v?.[labelKey]
    }

    const getOptionLabel = (a) => {
      return options[a]?.[labelKey]
    }

    const handleKeyUp = (e) => {
      if (e.key === ' ' || e.code === 'Space' || e.keyCode === 32) {
        setIsShow(true)
      }
    }

    const handleSelect = ({ index }) => {
      setTempValue(options[index])
    }

    const handleSubmit = () => {
      setLocalValue(tempValue)
      setIsShow(false)
    }

    return (
      <div>
        <Input
          ref={ref}
          label={label}
          readOnlyInput
          onKeyUp={handleKeyUp}
          value={formatValue(localValue)}
          onClick={() => setIsShow(true)}
          suffixIcon={<CalendarIcon />}
          {...props}
        />

        <DrawerModal
          show={isShow}
          dismissible={false}
          modalHeader={label}
          handleClose={() => setIsShow(false)}
        >
          <WheelPicker
            slideCount={options.length}
            label={pickerSuffix}
            startIndex={startIndex}
            onSelect={handleSelect}
            formatFn={getOptionLabel}
          />

          <div className="grid grid-cols-2 gap-3 mt-1">
            <Button className="w-full" type="button" onClick={handleSubmit}>
              تایید
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsShow(false)}
            >
              انصراف
            </Button>
          </div>
        </DrawerModal>
      </div>
    )
  }
)

export default SelectWheelInput
