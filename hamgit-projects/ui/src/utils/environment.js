function isServerSide() {
  return typeof window === 'undefined'
}

function isClientSide() {
  return typeof window !== 'undefined'
}

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

export { isProduction, isClientSide, isServerSide }
