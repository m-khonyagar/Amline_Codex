export function toArrayLocation(obj) {
  return obj?.lat ? Object.keys(obj).map((key) => obj[key]) : undefined
}

export function toObjectLocation(array) {
  return array?.length ? { lat: array[0], lng: array[1] } : undefined
}
