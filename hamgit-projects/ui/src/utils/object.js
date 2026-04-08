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
    const _value = get(obj, path)
    set(result, path, _value == null ? value : _value)
  })

  return result
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

export { pickWithDefaults }
