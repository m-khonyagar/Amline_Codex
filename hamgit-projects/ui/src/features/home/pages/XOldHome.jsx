import Image from 'next/image'
import Head from 'next/head'
import getConfig from 'next/config'
import Link from 'next/link'
import MainNavigation from '../components/OldMainNavigation'
import HomeBanners from '../components/HomeBanners'
import RequirementsSection from '../components/RequirementsSection'
import OldFooter from '../components/OldFooter'
import AdsSections from '../components/AdsSections'
import { LocationIcon, WalletIcon } from '@/components/icons'
import { useAppContext } from '@/features/app'
import { useAuthContext } from '@/features/auth'

function OldHomePage() {
  const { publicRuntimeConfig } = getConfig()
  const { defaultCities, setIsOpen } = useAppContext()
  const { isLoggedIn, initialLoading } = useAuthContext()

  return (
    <>
      <Head>
        <title>املاین: املاک امن و آنلاین</title>
        <meta name="robots" content="noindex" />
        <meta
          name="description"
          content="در املاین تمامی قراردادها شامل خرید و فروش، رهن، اجاره ملک و خودرو رو به‌صورت سریع و آنلاین بنویسید و با کد تخفیف، از حق کمیسیون رایگان برخوردار بشید."
        />
        <meta name="robots" content="INDEX,FOLLOW" />
        <meta name="twitter:title" content="املاین: املاک امن و آنلاین" />
        <meta
          name="twitter:description"
          content="املاین نوشتنِ قرارداد خرید فروش رهن اجارۀ ملک خودرو سریع آنلاین دریافت کد تخفیف حق کمیسیون رایگان نیازمندی‌های خرید رهن اجاره معاوضه ثبت آگهی تیم پشتیبانی قدم‌به‌قدم قراردادِ تلفنی"
        />
        <meta property="og:title" content="املاین: املاک امن و آنلاین" />
        <meta
          property="og:description"
          content="املاین نوشتنِ قرارداد خرید فروش رهن اجارۀ ملک خودرو سریع آنلاین دریافت کد تخفیف حق کمیسیون رایگان نیازمندی‌های خرید رهن اجاره معاوضه ثبت آگهی تیم پشتیبانی قدم‌به‌قدم قراردادِ تلفنی"
        />
        <link rel="canonical" href={publicRuntimeConfig.BASE_URL} />
      </Head>
      <div className="flex flex-col gap-9 flex-grow">
        <div className="flex px-6 py-2 bg-white border-y gap-2.5">
          <Image alt="logo" src="/images/logotype.svg" width={83} height={32} className="ml-auto" />

          {!initialLoading && isLoggedIn && (
            <>
              <Link href="/wallet" className="my-auto">
                <WalletIcon size={25} />
              </Link>
              <div className="border-l border-gray-200 flex-shrink" />
            </>
          )}

          <button type="button" onClick={() => setIsOpen(true)} className="flex fa my-auto">
            <LocationIcon />
            {defaultCities?.cities.length === 1 && defaultCities.city_name}
            {defaultCities?.cities.length > 1 && `${defaultCities.cities.length} شهر`}
          </button>
        </div>

        <MainNavigation />

        <HomeBanners />

        <RequirementsSection />

        <AdsSections />
      </div>

      <OldFooter className="mt-8" />
    </>
  )
}

export default OldHomePage
