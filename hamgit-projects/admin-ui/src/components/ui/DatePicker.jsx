import Input from './Input'
import MultiDatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import { parse as fnsParse } from 'date-fns'
import { forwardRef, useEffect, useState } from 'react'
import { CalendarIcon } from '../icons'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'

const DatePicker = forwardRef(
  (
    {
      value,
      onChange,
      label,
      error,
      range,
      placeholder,
      suffixIcon,
      format = 'DD MMMM YYYY',
      inputFormat = 'yyyy-MM-dd',
      outputFormat = 'YYYY-MM-DD',
      dayPicker = true,
      monthPicker = true,
      yearPicker = true,
      timePicker = false,
      hideSeconds = false,
      inputProps,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState('')
    const isRange = range || Array.isArray(value)

    useEffect(() => {
      if (value && localValue === '') {
        if (Array.isArray(value)) {
          const parsed = value.map((v) => {
            const d = v
              ? fnsParse(`${v}`, inputFormat, new Date(new Date().getFullYear(), 0, 1))
              : ''
            return new DateObject({ date: d, format: 'YYYY/MM/DD' }).convert(persian, persian_fa)
          })
          setLocalValue(parsed)
        } else {
          const date = value
            ? fnsParse(`${value}`, inputFormat, new Date(new Date().getFullYear(), 0, 1))
            : ''
          const dateObj = new DateObject({
            date: date,
            format: 'YYYY/MM/DD',
          }).convert(persian, persian_fa)
          setLocalValue(dateObj)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
      <MultiDatePicker
        // ref={ref}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        value={localValue}
        zIndex={9999}
        format={format}
        containerClassName="w-full"
        months={undefined}
        // disableDayPicker={!dayPicker}
        disableMonthPicker={!monthPicker}
        disableYearPicker={!yearPicker}
        hideMonth={!monthPicker}
        hideYear={!yearPicker}
        buttons={monthPicker || yearPicker}
        hideWeekDays={!monthPicker && !yearPicker}
        onlyYearPicker={!monthPicker && !dayPicker}
        plugins={[
          timePicker ? <TimePicker key="01" position="bottom" hideSeconds={hideSeconds} /> : null,
        ].filter((p) => !!p)}
        render={(_value, openCalendar, handleValueChange, locale) => (
          <Input
            readOnlyInput
            error={error}
            label={label}
            ref={ref}
            placeholder={placeholder}
            value={
              Array.isArray(_value)
                ? _value.map((d) => d?.toString()).join(props.dateSeparator || ' , ')
                : _value?.toString()
            }
            // onChange={onChange}
            locale={locale}
            onClick={() => openCalendar()}
            suffixIcon={suffixIcon || <CalendarIcon />}
            // classNames={{ wrapper: 'text-left dir-ltr', input: 'text-left' }}
            {...inputProps}
          />
        )}
        onChange={(date) => {
          if (!date) {
            onChange && onChange(isRange ? [] : '')
            setLocalValue('')
            return
          }

          if (Array.isArray(date)) {
            const formatted = date.map((d) =>
              d.convert(gregorian, gregorian_en).format(outputFormat)
            )
            onChange && onChange(isRange ? formatted : formatted[0])
            const isAllValid = date.every((d) => d && d.isValid)
            setLocalValue(isAllValid ? date : '')
          } else {
            const formatted = date.convert(gregorian, gregorian_en).format(outputFormat)
            onChange && onChange(formatted)
            setLocalValue(date.isValid ? date : '')
          }
        }}
        range={isRange}
        {...props}
      />
    )
  }
)

DatePicker.displayName = 'DatePicker'

export default DatePicker
