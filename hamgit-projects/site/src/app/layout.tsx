import Script from 'next/script'
import localFont from 'next/font/local'
import { env } from '@/config/env'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'
// import { GoogleTagManager } from '@next/third-parties/google'
import { GoftinoWidget } from '@/components/third-party'
import { Footer, Header } from '@/components/layout'

import type { Metadata } from 'next'

import './globals.css'
import { TopBanner } from '@/components/TopBanner'

const iranSansX = localFont({
  variable: '--font-iransans',
  src: [
    {
      path: '../assets/fonts/iransans/IRANSansX-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-DemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-DemiBold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/iransans/IRANSansX-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
})

const OrganJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Corporation',
  name: 'املاین',
  description:
    'در املاین تمامی قراردادها شامل خرید و فروش، رهن، اجاره ملک و خودرو رو به‌صورت سریع و آنلاین بنویسید و با کد تخفیف، از حق کمیسیون رایگان برخوردار بشید.',
  alternateName: ['املاین', 'املاک آنلاین', 'Amline', 'online real estate'],
  url: env.BASE_URL,
  email: 'info@amline.ir',
  telephone: '+982532048000',
  sameAs: ['https://www.linkedin.com/company/amline-ir/', 'https://eitaa.com/Amlinebime'],
  logo: `${env.BASE_URL}/images/logo.png`,
  founders: [
    {
      '@type': 'Person',
      name: 'Mohammad Khonyagar',
    },
  ],
  foundingDate: '2022',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Qom Province, Qom',
    addressLocality: 'Qom',
    addressRegion: 'Qom Province',
    postalCode: '3716875277',
    addressCountry: 'IR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '34.6126570478814',
    longitude: '50.8580129855449',
  },
  hasMap: 'https://maps.app.goo.gl/SHfi2okvPoqcZ3P46',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+982532048000',
    email: 'info@amline.ir',
    contactType: 'customer service',
    areaServed: 'IR',
    availableLanguage: ['fa'],
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '09:00',
    closes: '17:00',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: { default: 'املاین | املاک امن و آنلاین', template: '%s | املاین' },
  description:
    'در املاین تمامی قراردادها شامل خرید و فروش، رهن، اجاره ملک و خودرو رو به‌صورت سریع و آنلاین بنویسید و با کد تخفیف، از حق کمیسیون رایگان برخوردار شوید.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  authors: [{ name: 'املاین' }],
  openGraph: {
    url: '/',
    type: 'website',
    locale: 'fa_IR',
    title: 'املاین | املاک امن و آنلاین',
    description: 'خرید، فروش و اجاره ملک با اطمینان و به‌صورت آنلاین در املاین.',
  },
  twitter: {
    site: '@Amline_IR',
    creator: '@Amline_IR',
    card: 'summary_large_image',
    title: 'املاین | املاک امن و آنلاین',
    description:
      'خرید، فروش و اجاره ملک با اطمینان کامل در پلتفرم امن و آنلاین املاین. تجربه‌ای راحت، سریع و حرفه‌ای.',
  },
  other: {
    language: 'fa',
    'google-site-verification': 'KrPiJb9lg-b5mlwTgcMVsKaeWu1cwDWc3ar058Ww_1Q',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html dir="rtl" lang="fa">
      <head>
        <meta
          name="google-site-verification"
          content="3sIWCGrt6k8ZK_XkDJMxjsg7Uj7cZtAA2KCR5gto64w"
        />
      </head>
      <body className={`${iranSansX.className} antialiased`}>
        <Providers>
          <TopBanner houseImageSrc="/images/homeBanner.png" height={50} />
          <Header />
          <main className="min-h-[50vh]">{children}</main>
          <Footer />
        </Providers>

        <Toaster position="bottom-center" richColors />

        {/* <GoogleTagManager gtmId="GTM-N7KWBD8K" /> */}

        {/* OrganJsonLd */}
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(OrganJsonLd) }}
        />

        <GoftinoWidget widgetId="WvdcsP" strategy="lazyOnload" />
      </body>
    </html>
  )
}
