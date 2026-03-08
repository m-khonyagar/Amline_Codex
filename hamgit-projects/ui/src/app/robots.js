import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'

const { BASE_URL } = publicRuntimeConfig

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/auth/',
        '/contracts/',
        '/invoice/',
        '/profile/',
        '/requirements/edit/',
        '/requirements/new/',

        '/chat/',
        '/wallet/',

        '/invoice/payment/result',

        '/requirements/publish-status',
        '/requirements/swaps/*/edit',

        '/ads/new/',
        '/ads/edit/',
        '/ads/publish-status',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
