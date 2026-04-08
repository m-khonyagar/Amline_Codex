const createAdCategoryLink = (type, cat) => {
  if (!type || !cat) return ''
  return `/ads/${type?.toLocaleLowerCase()}/${cat?.toLocaleLowerCase()}`
}

const createAdLink = (type, cat, id) => {
  if (!type || !cat || !id) return ''
  return `${createAdCategoryLink(type, cat)}/${id}`
}

export { createAdLink, createAdCategoryLink }
