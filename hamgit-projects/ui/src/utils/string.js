/**
 * This function uses two pointers to move out from the ideal, to find the first
 * instance of a punctuation mark followed by a space. If one can't be found,
 * it will go with the first space closest to the ideal.
 * Source: https://github.com/alexandersmanning/read-more-react
 * @param {string} text
 * @param {number} [min = 80]
 * @param {number} [ideal = 100]
 * @param {number} [max = 200]
 * @returns {array}
 */
function trimText(text, min = 80, ideal = 100, max = 200) {
  const PUNCTUATION_LIST = ['.', ',', '!', '?', "'", '{', '}', '(', ')', '[', ']', '/']

  const spaceMatch = (character) => {
    return character === ' '
  }

  const punctuationMatch = (idx, _text) => {
    return PUNCTUATION_LIST.indexOf(_text[idx]) >= 0 && spaceMatch(_text[idx + 1])
  }

  const checkMatch = (idx, _text, _max, _min) => {
    return idx < _max && idx > _min && punctuationMatch(idx, _text)
  }

  if (max < min || ideal > max || ideal < min) {
    throw new Error(
      'The minimum length must be less than the maximum, and the ideal must be between the minimum and maximum.'
    )
  }

  if (text.length <= ideal) {
    return [text, '']
  }

  let pointerOne = ideal
  let pointerTwo = ideal
  let firstSpace = 0
  let resultIdx

  const setSpace = (idx) => {
    if (spaceMatch(text[idx])) {
      firstSpace = firstSpace || idx
    }
  }

  while (pointerOne < max || pointerTwo > min) {
    if (checkMatch(pointerOne, text, max, min)) {
      resultIdx = pointerOne + 1
      break
    } else if (checkMatch(pointerTwo, text, max, min)) {
      resultIdx = pointerTwo + 1
      break
    } else {
      setSpace(pointerOne)
      setSpace(pointerTwo)
    }

    pointerOne += 1
    pointerTwo -= 1
  }

  if (resultIdx === undefined) {
    if (firstSpace && firstSpace >= min && firstSpace <= max) {
      resultIdx = firstSpace
    } else if (ideal - min < max - ideal) {
      resultIdx = min
    } else {
      resultIdx = max
    }
  }

  return [text.slice(0, resultIdx), text.slice(resultIdx).trim()]
}

const generateRandomString = (length = 32) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export { trimText, generateRandomString }
