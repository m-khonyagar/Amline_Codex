import { format } from 'date-fns-jalali'

const toPersianDigits = (number) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return number.toString().replace(/\d/g, (digit) => persianDigits[digit])
}

// format(new Date(party.birth_date), 'yyyy/MM/dd') : ''

export const formatDate = (date) => {
  if (!date) return '----'
  const formattedDate = format(new Date(date), 'yyyy/MM/dd')
  return toPersianDigits(formattedDate)
}
