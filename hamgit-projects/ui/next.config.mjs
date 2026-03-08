/* eslint-disable prefer-destructuring */
import path from 'path'
import * as url from 'node:url'
import NextBundleAnalyzer from '@next/bundle-analyzer'
import publicRuntimeConfig from './src/configs/public-runtime-config.mjs'

const API_URL = process.env.API_URL

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  publicRuntimeConfig,
  reactStrictMode: false,
  skipTrailingSlashRedirect: true,

  sassOptions: {
    includePaths: [path.join(__dirname, 'src/assets/styles')],
    prependData: `@import "_functions.scss";`,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: `${API_URL}/:path*/`,
      },
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
    ]
  },

  async headers() {
    if (process.env.APP_ENV !== 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow',
            },
          ],
        },
      ]
    }
    return []
  },

  images: {
    domains: [
      'amline-public.storage.iran.liara.space',
      'amline-minio.darkube.app',
      'amline-blog.darkube.app',
      'https://www.google.com',
    ],
  },

  experimental: {
    scrollRestoration: true,
  },
}

export default withBundleAnalyzer(nextConfig)
