import { UAParser } from 'ua-parser-js'

function getUA(userAgent) {
  const parser = new UAParser(userAgent)

  const result = parser.getResult()

  return {
    ...result,
    isCrawler: !result.browser?.name,
    isMobile: result.device?.type === 'mobile',
    isTablet: result.device?.type === 'tablet',
    isFirefox: !!result.browser?.name?.toLowerCase()?.includes('firefox'),
    isPc: result.device?.type !== 'mobile' && result.device?.type !== 'tablet',
  }
}

export { getUA }
