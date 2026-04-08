import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { parse, format as gregorianFormat } from 'date-fns'
import { format as formatDate, formatISO } from 'date-fns-jalali'
import Input from '../Input'
import DatePicker from '../DatePicker/DatePicker'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { CalendarIcon } from '@/components/icons'
import Button from '../Button'
import DrawerModal from '../DrawerModal'

function DatePickerInput({
  value,
  onChange,
  defaultValue,
  label,
  valueFormat = 'iso',
  format = 'd MMMM yyyy',
  ...props
}) {
  const pickerRef = useRef()
  const [isShow, setIsShow] = useState(false)

  const [localValue, setLocalValue] = useUncontrolled({
    value:
      // eslint-disable-next-line no-nested-ternary
      !value
        ? value
        : valueFormat === 'iso'
          ? value
          : parse(value, valueFormat, new Date(new Date().getFullYear(), 0, 1)),
    onChange,
    defaultValue,
    // finalValue: new Date(),
  })

  const formatValue = (date) => {
    if (!date) return ''
    return formatDate(date, format)
  }

  const handleSubmit = () => {
    const date = pickerRef.current?.getDate()

    if (date) {
      setLocalValue(valueFormat === 'iso' ? formatISO(date) : gregorianFormat(date, valueFormat))
      setIsShow(false)
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === ' ' || e.code === 'Space' || e.keyCode === 32) {
      setIsShow(true)
    }
  }

  const {
    daySuffix,
    monthSuffix,
    yearSuffix,
    dayPicker = true,
    monthPicker = true,
    yearPicker = true,
    ...InputProps
  } = props
  // const dayPickerProps =

  return (
    <div>
      <Input
        readOnlyInput
        label={label}
        onKeyUp={handleKeyUp}
        value={formatValue(localValue)}
        onClick={() => setIsShow(true)}
        suffixIcon={<CalendarIcon />}
        {...InputProps}
      />

      <DrawerModal
        show={isShow}
        dismissible={false}
        modalHeader={label}
        handleClose={() => setIsShow(false)}
      >
        <DatePicker
          ref={pickerRef}
          defaultDate={localValue}
          dayPicker={dayPicker}
          monthPicker={monthPicker}
          yearPicker={yearPicker}
          daySuffix={daySuffix}
          monthSuffix={monthSuffix}
          yearSuffix={yearSuffix}
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

DatePickerInput.propTypes = {
  format: PropTypes.string,
  valueFormat: PropTypes.string,
  daySuffix: PropTypes.string,
  monthSuffix: PropTypes.string,
  yearSuffix: PropTypes.string,
  dayPicker: PropTypes.bool,
  monthPicker: PropTypes.bool,
  yearPicker: PropTypes.bool,
  ...Input.propTypes,
}

export default DatePickerInput
