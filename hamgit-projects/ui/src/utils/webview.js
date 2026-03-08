import { getUploadUrl } from '@/data/api/file'
import { getAccessToken } from '@/features/auth'
import { isClientSide } from '@/utils/environment'

const getWebViewInterface = () => {
  return isClientSide() ? window.WebViewInterface : null
}

const isWebView = () => {
  return Boolean(isClientSide() && window?.WebViewInterface)
}

/**
 * pick and upload file from webview
 * @param {string} fileType
 * @param {function} cb
 * @param {object} [options = {}]
 * @param {number} [options.maxCount = 1] max selected file
 * @param {number} [options.maxSizeB] max size in bite
 * @param {Array<string>} [options.accept = ["image/png", "image/jpeg"]] allowed mime types
 */
const pickAndUploadFile = (fileType, cb, options = {}) => {
  const webview = getWebViewInterface()

  if (!webview) {
    throw new Error('webview interface is not available')
  }

  const { maxCount = 1, maxSizeB = null, accept = ['image/png', 'image/jpeg'] } = options

  webview.pickAndUploadFile(
    JSON.stringify({
      accept,
      maxCount,
      maxSizeB,
      fileType,
      bucketName: fileType,
      uploadUrl: getUploadUrl(),
      uploadToken: getAccessToken(),
    })
  )

  window.setUploadResult = (files) => cb(files)
}

/**
 * toggle refresh by swap down
 * @param {boolean} status
 */
const toggleRefresh = (status) => {
  const webview = getWebViewInterface()

  if (!webview) {
    throw new Error('webview interface is not available')
  }

  try {
    webview.toggleRefresh(status)
  } catch (error) {
    console.error(error)
  }
}

const getClientInfo = () => {
  const webview = getWebViewInterface()

  if (!webview) {
    throw new Error('webview interface is not available')
  }

  try {
    const info = webview.getClientInfo()

    return JSON.parse(info)
  } catch (error) {
    console.error(error)
  }

  return null
}

const downloadBlobFile = async (blob, fileName) => {
  const webview = getWebViewInterface()

  if (!webview) {
    throw new Error('webview interface is not available')
  }

  return new Promise((resolve, _) => {
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        webview.downloadBlobFile(reader.result, fileName)
        resolve()
      }
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error(error)
    }
  })
}

export {
  isWebView,
  getWebViewInterface,
  pickAndUploadFile,
  toggleRefresh,
  getClientInfo,
  downloadBlobFile,
}
