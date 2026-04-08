import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SEO from '@/components/SEO'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'
import { useGuideContext, useTour } from '@/features/guide'
import { MainNavigation } from '../components/MainNavigation'
import SidePanel from '../components/SidePanel'
import Button from '@/components/ui/Button'
import { HelpIcon } from '@/components/icons'
import heroImage from '@/assets/images/home-banners/slider-01.jpg'
import heroImage1 from '@/assets/images/home-banners/slider-02.jpg'
import heroImage2 from '@/assets/images/home-banners/slider-03.jpg'
// import bgContract from '@/assets/images/home-banners/bg_contract.png'
import signContractImg from '@/assets/images/sign_contract_white.svg'
import calculatorImg from '@/assets/images/calculator.svg'
import Footer from '../components/Footer'
import Slider from '@/components/ui/Slider'
// import HowWriteContract from '../components/HowWriteContract'
import { HowToWriteContract } from '../site-components/HowToWriteContract'
import { Features } from '../site-components/Features'
import { SampleContract } from '../site-components/SampleContract'

function Home() {
  const { setIsOpen: setGuideIsOpen } = useGuideContext()
  const { highlight } = useTour()

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour')
    if (!hasSeenTour) {
      highlight({
        element: '#help',
        popover: {
          description: 'اگه سوالی داشته باشی از اینجا میتونی جوابش رو پیدا کنی!',
          side: 'bottom',
        },
      })
      localStorage.setItem('hasSeenTour', 'true')
    }
  }, [highlight])

  return (
    <>
      <SEO
        noIndex
        canonical={publicRuntimeConfig.BASE_URL}
        openGraph={{
          description:
            'املاین نوشتنِ قرارداد خرید فروش رهن اجارۀ ملک خودرو سریع آنلاین دریافت کد تخفیف حق کمیسیون رایگان نیازمندی‌های خرید رهن اجاره معاوضه ثبت آگهی تیم پشتیبانی قدم‌به‌قدم قراردادِ تلفنی',
        }}
      />

      <div className="flex items-center justify-between gap-1 border-b border-[#E1E1E1] bg-white px-7 py-3">
        <SidePanel />

        <Link href="/">
          <h1>
            <Image alt="logo" src="/images/logotype.svg" width={83} height={32} />
          </h1>
        </Link>

        <button
          type="button"
          onClick={() => setGuideIsOpen(true)}
          className="flex items-center justify-center"
        >
          <HelpIcon id="help" />
        </button>
      </div>

      <Slider options={{ loop: true }} autoplayOptions={{ delay: 5000 }}>
        <div className="relative flex-[0_0_100%]">
          <Link href="/contracts/new" className="relative block w-full aspect-[180/100]">
            <Image
              style={{ objectFit: 'cover' }}
              src={heroImage.src}
              alt="قرارداد رهن و اجاره"
              sizes="100vw"
              priority
              fill
            />
          </Link>
        </div>
        <div className="relative flex-[0_0_100%]">
          <a
            href="https://amline.ir/licenses?title=backurl"
            className="relative block w-full aspect-[180/100]"
          >
            <Image
              style={{ objectFit: 'cover' }}
              src={heroImage1.src}
              alt="قرارداد رهن و اجاره"
              sizes="100vw"
              priority
              fill
            />
          </a>
        </div>

        <div className="relative flex-[0_0_100%]">
          <a
            href="http://admin.amline.ir/login?title=backurl"
            className="relative block w-full aspect-[180/100]"
          >
            <Image
              style={{ objectFit: 'cover' }}
              src={heroImage2.src}
              alt="قرارداد رهن و اجاره"
              sizes="100vw"
              priority
              fill
            />
          </a>
        </div>
      </Slider>

      <div className="pt-10 px-7">
        <Button className="w-full gap-3 mb-5 font-medium" href="/contracts/new">
          <Image src={signContractImg.src} alt="انعقاد قرارداد" width={40} height={40} />
          انعقاد قرارداد
        </Button>

        <Button
          className="w-full bg-white hover:bg-gray-50 text-primary font-medium gap-3 mb-10 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)]"
          href="/commission/calculate"
        >
          <Image src={calculatorImg.src} alt="محاسبه کمیسیون" width={40} height={40} />
          محاسبه کمیسیون
        </Button>
      </div>

      <MainNavigation />
      <HowToWriteContract className="mt-10 sm:mt-28 md:mt-32" />
      <Features className="mt-10 sm:mt-28 md:mt-32" />
      <SampleContract className="mt-10 pl-2 pr-2 sm:mt-24 md:mt-28 lg:mt-32" />
      {/* <div
        className="bg-cover bg-no-repeat px-3 pb-4 pt-24"
        style={{ backgroundImage: `url(${bgContract.src})` }}
      >
        <HowWriteContract />
      </div> */}

      <Footer className="-mb-8 mt-7" hideTrust={false} />
    </>
  )
}

export default Home
