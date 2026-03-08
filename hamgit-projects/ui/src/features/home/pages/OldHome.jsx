import Head from 'next/head'
import getConfig from 'next/config'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { useAppContext } from '@/features/app'
import { useGuideContext, useTour } from '@/features/guide'
import { useAuthContext } from '@/features/auth'
import { HelpIcon, LocationIcon, WalletIcon } from '@/components/icons'
import OldFooter from '../components/OldFooter'
import { MainNavigation } from '../components/MainNavigation'
import MainBanners from '../components/MainBanners'
import HomeBanners from '../components/HomeBanners'
// import About from '../components/About'
import TrustItemsGrid from '../components/TrustItemsGrid'
import { HowCreateContract } from '../components/HowCreateContract'
import WhyAmline from '../components/WhyAmline'
// import OldStats from '../components/OldStats'
import Partners from '../components/Partners'
import DownloadApp from '../components/DownloadApp'
import HowCanTrust from '../components/HowCanTrust'
import BlogBanners from '../components/BlogBanners'

function HomePage() {
  const { publicRuntimeConfig } = getConfig()
  const { defaultCities, setIsOpen } = useAppContext()
  const { setIsOpen: setGuideIsOpen } = useGuideContext()
  const { isLoggedIn, initialLoading } = useAuthContext()
  const { highlight } = useTour()

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour')
    if (!hasSeenTour && defaultCities?.cities.length >= 1) {
      highlight({
        element: '#help',
        popover: {
          description: 'اگه سوالی داشته باشی از اینجا میتونی جوابش رو پیدا کنی!',
          side: 'bottom',
        },
      })
      localStorage.setItem('hasSeenTour', 'true')
    }
  }, [defaultCities?.cities.length, highlight])

  return (
    <>
      <Head>
        <title>املاین: املاک امن و آنلاین</title>
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

      <div className="flex flex-col flex-grow">
        <div className="flex px-4 py-2 bg-white gap-2.5">
          <Image alt="logo" src="/images/logotype.svg" width={83} height={32} className="ml-auto" />

          {!initialLoading && isLoggedIn && (
            <>
              <Link href="/wallet" className="my-auto">
                <WalletIcon size={25} />
              </Link>
              <div className="border-l border-gray-200 flex-shrink" />
            </>
          )}

          <button
            type="button"
            aria-label="Help"
            onClick={() => setGuideIsOpen(true)}
            className="flex items-center justify-center"
          >
            <HelpIcon size={22} id="help" />
          </button>
          <div className="border-l border-gray-200 flex-shrink" />

          <button type="button" onClick={() => setIsOpen(true)} className="flex fa my-auto">
            <LocationIcon />
            {defaultCities?.cities.length === 1 && defaultCities.city_name}
            {defaultCities?.cities.length > 1 && `${defaultCities.cities.length} شهر`}
          </button>
        </div>

        <MainBanners className="mt-4 mx-4" />

        <div className="mt-6 bg-teal-50 py-4 rounded-t-3xl">
          <MainNavigation />

          <HomeBanners className="mt-8 mx-4" />

          {/* <About className="mt-8 mx-4" /> */}
        </div>

        <div
          className="py-8"
          style={{
            backgroundSize: '100% 100%',
            backgroundPosition: '0% 0%,0px 0px,0px 0px,0px 0px,0px 0px,0px 0px',
            backgroundImage:
              'radial-gradient(50% 50% at 0% 20%, #B6543017 0%, #073AFF00 100%),radial-gradient(100% 46% at 100% 60%, #91A4A53D 1%, #073AFF00 98%)',
          }}
        >
          <WhyAmline className="mx-4" />

          <BlogBanners className="mt-8 mx-2" />

          <HowCreateContract className="mt-8 " />

          <TrustItemsGrid className="mt-12 mx-4" />

          {/* <OldStats className="mt-12 mx-6" /> */}

          <HowCanTrust className="mt-20" />

          <Partners className="mt-16" />

          <DownloadApp className="mt-8" />
        </div>
      </div>

      <OldFooter className="mt-8" showTrust={false} />
    </>
  )
}

export default HomePage
