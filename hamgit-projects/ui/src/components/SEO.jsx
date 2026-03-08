import Head from 'next/head'

export default function SEO({
  title = 'املاین | املاک امن و آنلاین',
  description = 'در املاین تمامی قراردادها شامل خرید و فروش، رهن، اجاره ملک و خودرو رو به‌صورت سریع و آنلاین بنویسید و با کد تخفیف، از حق کمیسیون رایگان برخوردار بشید.',
  keywords = 'املاین, املاک آنلاین, خرید و فروش ملک, اجاره آنلاین, قرارداد هوشمند املاک, Amline, online real estate, property contracts, commission-free real estate',
  openGraph,
  canonical = '',
  robots = '',
  noIndex = false,
  children,
}) {
  // Construct full title with brand name
  const fullTitle = title.includes('املاین') ? title : `${title} | املاین`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={description} />
      <meta key="keywords" name="keywords" content={keywords} />
      {robots && <meta key="robots" name="robots" content={robots} />}
      {noIndex && <meta key="robots-noindex" name="robots" content="noindex, follow" />}

      {/* Open Graph / Social */}
      {openGraph?.siteName && (
        <meta key="og:site_name" property="og:site_name" content={openGraph.siteName} />
      )}
      {openGraph?.locale && (
        <meta key="og:locale" property="og:locale" content={openGraph.locale} />
      )}
      <meta key="og:title" property="og:title" content={openGraph?.title || fullTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={openGraph?.description || description}
      />
      <meta key="og:type" property="og:type" content={openGraph?.type || 'website'} />
      {openGraph?.image && <meta key="og:image" property="og:image" content={openGraph.image} />}
      {openGraph?.url && <meta key="og:url" property="og:url" content={openGraph.url} />}

      {/* Twitter */}
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:site" name="twitter:site" content="@amline" />
      <meta key="twitter:creator" name="twitter:creator" content="@amline" />
      <meta key="twitter:title" name="twitter:title" content={openGraph?.title || fullTitle} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={openGraph?.description || description}
      />
      {openGraph?.image && (
        <meta key="twitter:image" name="twitter:image" content={openGraph.image} />
      )}

      {/* Canonical URL */}
      {canonical && <link key="canonical" rel="canonical" href={canonical} />}

      {/* Allow for additional custom head elements */}
      {children}
    </Head>
  )
}
