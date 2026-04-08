import { format, parseISO } from 'date-fns-jalali'

/**
 * Calculate the number of months between two dates
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {number} - Total months between the two dates
 */
export const getMonthsDifference = (startDate, endDate) => {
  if (typeof startDate !== 'string' || typeof endDate !== 'string') return 0

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start) || Number.isNaN(end)) return 0

  const yearsDifference = end.getFullYear() - start.getFullYear()
  const monthsDifference = end.getMonth() - start.getMonth()

  return yearsDifference * 12 + monthsDifference
}

/**
 * Calculate the number of days between two dates
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {number} - Total days between the two dates
 */
export const getDaysDifference = (startDate, endDate) => {
  if (typeof startDate !== 'string' || typeof endDate !== 'string') return 0

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0

  const diffTime = end.getTime() - start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // Convert milliseconds to days
}

/**
 * Calculates the difference between two dates in years, months, and days using Persian calendar.
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Object} An object containing the difference in Persian years, months, and days.
 */
export const getDateDifference = (startDate, endDate) => {
  if (typeof startDate !== 'string' || typeof endDate !== 'string')
    return { years: 0, months: 0, days: 0 }

  const start = parseISO(startDate)
  const end = parseISO(endDate)

  if (Number.isNaN(start) || Number.isNaN(end)) return { years: 0, months: 0, days: 0 }

  // Get Persian date components
  let startYear = parseInt(format(start, 'yyyy'), 10)
  let startMonth = parseInt(format(start, 'MM'), 10)
  let startDay = parseInt(format(start, 'dd'), 10)
  let endYear = parseInt(format(end, 'yyyy'), 10)
  let endMonth = parseInt(format(end, 'MM'), 10)
  let endDay = parseInt(format(end, 'dd'), 10)

  if (
    startYear > endYear ||
    (startYear === endYear && startMonth > endMonth) ||
    (startYear === endYear && startMonth === endMonth && startDay > endDay)
  ) {
    ;[startYear, startMonth, startDay, endYear, endMonth, endDay] = [
      endYear,
      endMonth,
      endDay,
      startYear,
      startMonth,
      startDay,
    ]
  }

  let years = endYear - startYear
  let months = endMonth - startMonth
  let days = endDay - startDay

  // Handle negative days
  if (days < 0) {
    // Get last day of Persian month (29, 30 or 31)
    const monthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
    const lastDay = monthLengths[endMonth - 2] // -1 for zero-based, -1 for previous month
    days += lastDay
    months -= 1
  }

  // Handle negative months
  if (months < 0) {
    months += 12
    years -= 1
  }

  return { years, months, days }
}
