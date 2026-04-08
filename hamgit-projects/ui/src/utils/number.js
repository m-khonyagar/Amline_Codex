/**
 * Converts Arabic or Persian numbers to English
 * @param {string} text - Text with Arabic or Persian numbers
 * @returns {string} Text with English numbers
 */
function toEnglishDigits(text) {
  return text
    .replace(/۰/g, '0')
    .replace(/۱/g, '1')
    .replace(/۲/g, '2')
    .replace(/۳/g, '3')
    .replace(/۴/g, '4')
    .replace(/۵/g, '5')
    .replace(/۶/g, '6')
    .replace(/۷/g, '7')
    .replace(/۸/g, '8')
    .replace(/۹/g, '9')
    .replace(/٠/g, '0')
    .replace(/١/g, '1')
    .replace(/٢/g, '2')
    .replace(/٣/g, '3')
    .replace(/٤/g, '4')
    .replace(/٥/g, '5')
    .replace(/٦/g, '6')
    .replace(/٧/g, '7')
    .replace(/٨/g, '8')
    .replace(/٩/g, '9')
}
function numberToPersianWords(number, { ordinal = false } = {}) {
  const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه']
  const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود']
  const teens = [
    'ده',
    'یازده',
    'دوازده',
    'سیزده',
    'چهارده',
    'پانزده',
    'شانزده',
    'هفده',
    'هجده',
    'نوزده',
  ]
  const hundreds = [
    '',
    'یکصد',
    'دویست',
    'سیصد',
    'چهارصد',
    'پانصد',
    'ششصد',
    'هفتصد',
    'هشتصد',
    'نهصد',
  ]
  const bigUnits = ['', 'هزار', 'میلیون', 'میلیارد']
  const ordinalSuffix = 'م'

  function convertHundreds(num) {
    if (num === 0) return ''
    if (num < 10) return ones[num]
    if (num < 20) return teens[num - 10]
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ` و ${ones[num % 10]}` : '')
    }
    return (
      hundreds[Math.floor(num / 100)] + (num % 100 !== 0 ? ` و ${convertHundreds(num % 100)}` : '')
    )
  }

  if (number === 0) return ordinal ? `صفر${ordinalSuffix}` : 'صفر'
  if (number < 0) return `منفی ${numberToPersianWords(-number, ordinal)}`

  const parts = []
  let bigUnitIndex = 0

  let number_ = number
  while (number_ > 0) {
    const numChunk = number_ % 1000
    if (numChunk !== 0) {
      let part = convertHundreds(numChunk)
      if (bigUnits[bigUnitIndex]) {
        part += ` ${bigUnits[bigUnitIndex]}`
      }
      parts.push(part)
    }
    number_ = Math.floor(number_ / 1000)
    bigUnitIndex += 1
  }

  let result = parts.reverse().join(' و ')

  if (ordinal) {
    // Add ordinal suffix to the last significant part
    const resultParts = result.split(' و ')
    resultParts[resultParts.length - 1] += ordinalSuffix
    result = resultParts.join(' و ')
  }

  return result
}

const toPersianNumber = (num) => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  return num.toString().replace(/\d/g, (digit) => persianDigits[digit])
}

const numberSeparator = (number) => {
  if (typeof number !== 'number' && typeof number !== 'string') {
    return ''
  }

  return typeof number === 'number'
    ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
    : number.replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
}

const cardNumberSeparator = (number, separator = ' - ') => {
  if (typeof number !== 'number' && typeof number !== 'string') {
    return ''
  }

  return typeof number === 'number'
    ? number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, separator)
    : number.replace(/\B(?=(\d{4})+(?!\d))/g, separator)
}

export {
  toEnglishDigits,
  numberSeparator,
  toPersianNumber,
  cardNumberSeparator,
  numberToPersianWords,
}
