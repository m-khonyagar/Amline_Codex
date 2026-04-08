import { formatDistanceToNow, format } from 'date-fns-jalali'

const formatYear = (year) => {
  try {
    const date = new Date(year, 5, 1)
    return format(date, 'yyyy')
  } catch (err) {
    return null
  }
}

const formatFromNow = (time) => {
  try {
    return `${formatDistanceToNow(new Date(time))} پیش`.replace('حدود', '')
  } catch (err) {
    return null
  }
}

export { formatYear, formatFromNow }
