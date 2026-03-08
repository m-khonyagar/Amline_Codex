import type { NextConfig } from 'next'
import { env } from '@/config/env'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [new URL(`${env.BLOG_URL}/wp-content/uploads/**`)],
  },
}

export default nextConfig
