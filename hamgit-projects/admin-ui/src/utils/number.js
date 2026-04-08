/**
 * Converts Arabic or Persian numbers to English
 * @param {string} text - Text with Arabic or Persian numbers
 * @returns {string} Text with English numbers
 */
function toEnglishDigits(text) {
  if (typeof text !== 'number' && typeof text !== 'string') return ''
  return text.toString().replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
}

const toPersianNumber = (num) => {
  if (typeof num !== 'number' && typeof num !== 'string') return null

  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  return num.toString().replace(/\d/g, (digit) => persianDigits[digit])
}

const numberSeparator = (number) => {
  if (typeof number !== 'number' && typeof number !== 'string') return ''

  return typeof number === 'number'
    ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
    : number.replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
}

const formatAmount = (number) => {
  const separated = numberSeparator(number)
  return toPersianNumber(separated)
}

const parseNumber = (value) =>
  typeof value === 'string' ? Number(value.replace(/,/g, '')) || null : null

export { formatAmount, numberSeparator, toEnglishDigits, toPersianNumber, parseNumber }
