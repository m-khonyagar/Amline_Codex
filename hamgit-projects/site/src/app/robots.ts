import { MetadataRoute } from 'next'
import { env } from '@/config/env'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.BASE_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/blog/wp-admin/', '/blog/wp-includes/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
