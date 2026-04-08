import PropTypes from 'prop-types'
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react'
import { format, newDate, getDaysInMonth } from 'date-fns-jalali'
import { faIR } from 'date-fns-jalali/locale'
import { cn } from '@/utils/dom'

import Wheel from './Wheel'

import classes from './DatePicker.module.scss'

const YEAR_COUNT = 100
const NEXT_YEAR_COUNT = 5

let vibrateOnceIndex = null
const vibrateOnce = (i) => {
  if (i === vibrateOnceIndex) return

  // TODO: temporary disable
  // navigator?.vibrate?.(50)

  vibrateOnceIndex = i
}

const getNowYear = () => Number(format(new Date(), 'yyyy'))

const DatePicker = forwardRef(
  (
    {
      defaultDate,
      onSelect,
      daySuffix,
      monthSuffix,
      yearSuffix,
      dayPicker = true,
      monthPicker = true,
      yearPicker = true,
    },
    ref
  ) => {
    const [nowYear] = useState(getNowYear)
    const [date, setDate] = useState(() => {
      if (defaultDate) return new Date(defaultDate)

      if (!monthPicker && !dayPicker) {
        const currentDate = new Date()
        currentDate.setMonth(5)
        return currentDate
      }

      return new Date()
    })
    const [daysInMonth, setDaysInMonth] = useState(() => getDaysInMonth(date))

    const formatDay = (d) => {
      return d + 1
    }

    const formatMonth = (a) => {
      return faIR.localize.month(a)
    }

    const formatYear = (a) => {
      return nowYear - (YEAR_COUNT - NEXT_YEAR_COUNT) + a + 1
    }

    const startIndexes = useMemo(() => {
      const _date = format(date, 'yyyy-M-d').split('-')

      return {
        day: _date[2] - 1,
        month: _date[1] - 1,
        year: _date[0] - nowYear + YEAR_COUNT - NEXT_YEAR_COUNT - 1,
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSelect = useCallback(
      (key, { index }) => {
        const _dateParts = format(date, 'yyyy-M-d').split('-')

        let day = key === 'day' ? index + 1 : Number(_dateParts[2])
        const month = key === 'month' ? index + 1 : Number(_dateParts[1])
        const year =
          key === 'year'
            ? nowYear + index - YEAR_COUNT + NEXT_YEAR_COUNT + 1
            : Number(_dateParts[0])

        const _daysInMonth = getDaysInMonth(newDate(year, month - 1, 1))

        if (day > _daysInMonth) {
          day = _daysInMonth
        }

        const _date = newDate(year, month - 1, day)

        setDate(_date)
        setDaysInMonth(_daysInMonth)

        onSelect?.(_date)
      },
      [date, nowYear, onSelect]
    )

    const handleScroll = useCallback(({ index }) => {
      vibrateOnce(index)
    }, [])

    useImperativeHandle(ref, () => ({
      getDate: () => date,
    }))

    return (
      <div data-vaul-no-drag className={cn(classes['date-picker'], 'fa')}>
        {dayPicker && (
          <Wheel
            label={daySuffix}
            slideCount={daysInMonth}
            formatFn={formatDay}
            onScroll={handleScroll}
            startIndex={startIndexes.day}
            onSelect={(e) => handleSelect('day', e)}
          />
        )}

        {monthPicker && (
          <Wheel
            slideCount={12}
            label={monthSuffix}
            formatFn={formatMonth}
            onScroll={handleScroll}
            startIndex={startIndexes.month}
            onSelect={(e) => handleSelect('month', e)}
          />
        )}

        {yearPicker && (
          <Wheel
            label={yearSuffix}
            slideCount={YEAR_COUNT}
            formatFn={formatYear}
            onScroll={handleScroll}
            startIndex={startIndexes.year}
            onSelect={(e) => handleSelect('year', e)}
          />
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

DatePicker.propTypes = {
  daySuffix: PropTypes.string,
  monthSuffix: PropTypes.string,
  yearSuffix: PropTypes.string,
  dayPicker: PropTypes.bool,
  monthPicker: PropTypes.bool,
  yearPicker: PropTypes.bool,
}

export default DatePicker
