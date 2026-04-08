function modernCopy(value) {
  navigator.clipboard.writeText(`${value}`)
}

function legacyCopy(value) {
  const temporaryInput = document.createElement('input')
  temporaryInput.value = `${value}`
  document.body.appendChild(temporaryInput)
  temporaryInput.select()
  document.execCommand('copy')
  document.body.removeChild(temporaryInput)
}

export function copyToClipboard(value) {
  if (navigator.clipboard) {
    modernCopy(value)
  } else {
    legacyCopy(value)
  }
}
