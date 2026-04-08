import get from 'lodash/get'
import set from 'lodash/set'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import camelCase from 'lodash/camelCase'
import transform from 'lodash/transform'

/**
 * pick with defaults
 * @param {*} obj The object to query.
 * @param {defaults} obj The default object.
 */
const pickWithDefaults = (obj, defaults = {}) => {
  if (!obj) return {}

  const result = {}

  Object.entries(defaults).forEach(([path, value]) => {
    let _path = path
    let _default = value

    if (isObject(value) && value.path) {
      _path = value.path
      _default = value.default
    }

    const _value = get(obj, _path)

    set(result, path, _value == null ? _default : _value)
  })

  return result
}

const convertEmptyStringsToNull = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  const copy = Array.isArray(obj) ? [] : {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      copy[key] = convertEmptyStringsToNull(value)
    } else {
      copy[key] = value === '' ? null : value
    }
  }

  return copy
}

const convertUndefinedToNull = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertUndefinedToNull)
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : convertUndefinedToNull(v)])
    )
  }
  return obj
}

export function camelize(obj) {
  return transform(obj, (acc, value, key, target) => {
    let camelKey = isArray(target) ? key : camelCase(key)
    while (camelKey in acc) {
      camelKey = `$${camelKey}`
    }
    acc[camelKey] = isObject(value) ? camelize(value) : value
  })
}

export { convertEmptyStringsToNull, pickWithDefaults, convertUndefinedToNull }
