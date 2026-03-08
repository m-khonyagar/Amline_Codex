export function removeEmptyFilters(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => ![null, '', undefined, false, 'false'].includes(v))
  )
}
