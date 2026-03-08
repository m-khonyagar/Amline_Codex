/**
 * helper function to find option item from a list
 * @param {Array.<{myNumber: Number, myString: String|Number}>} options
 * @param {String|Number} value
 * @returns {Object|undefined}
 */
const findOption = (options, value) => {
  return options.find((o) => o.value === value)
}

/**
 * helper function to get option label from a list
 * @param {Array.<{myNumber: Number, myString: String|Number}>} options
 * @param {String|Number} value
 * @returns {string|undefined}
 */
const translateEnum = (enumOptions, value) => {
  return findOption(enumOptions, value)?.label
}

export { findOption, translateEnum }
