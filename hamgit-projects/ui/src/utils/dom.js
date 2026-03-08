import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 * @param arr {array}
 * @param sep {string}
 * @returns {arr}
 */
export function intersperse(arr, sep) {
  if (arr.length === 0) {
    return []
  }

  return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]])
}

/**
 * get user full name
 * @param user
 * @returns {string}
 */
export function fullName(user) {
  if (!user || !user.first_name || !user.last_name) return ''
  return `${user.first_name} ${user.last_name}`
}
