/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CollapseBox from '@/components/ui/CollapseBox'
import { EitaaIcon, LinkedInIcon, LocationIcon, PhoneIcon } from '@/components/icons'
import { useGuideContext } from '@/features/guide'
import { COMPANY_ADDRESS, supportPhones } from '../constants'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'
import TrustItems from './TrustItems'
import { cn } from '@/utils/dom'

function Footer({
  className: wrapperClassName,
  infoClassName,
  hideNav = false,
  hideTrust = true,
  hideInfo = false,
  hideSiteLink = false,
}) {
  const { setIsSupportModalOpen } = useGuideContext()

  const scrollToTarget = (elementId) => {
    const downloadSection = document.getElementById(elementId)
    if (downloadSection) {
      downloadSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className={wrapperClassName}>
      {!hideNav && (
        <div className="p-7">
          <CollapseBox label="خدمات مشتریان" className="py-2 text-sm">
            <div className="flex flex-col gap-3 items-start pt-2">
              <button
                type="button"
                className="text-gray-700 hover:text-teal-700"
                // eslint-disable-next-line no-undef
                onClick={() => (typeof Goftino !== 'undefined' ? Goftino.open() : null)}
              >
                ارتباط با پشتیبانی
              </button>
              <Link href="/about-us" className="text-gray-700 hover:text-teal-700">
                درباره ما
              </Link>
            </div>
          </CollapseBox>

          <CollapseBox label="راهنمای املاین" className="border-t py-2 text-sm">
            <div className="flex flex-col gap-3 items-start pt-2">
              <Link href="/guide/contract" className="text-gray-700 hover:text-teal-700">
                راهنمای انعقاد قرارداد
              </Link>
              <Link href="/commission/calculate" className="text-gray-700 hover:text-teal-700">
                نحوه محاسبه کمیسیون
              </Link>
              <Link
                href="/landing/phone-tracking-code"
                className="text-gray-700 hover:text-teal-700"
              >
                روند دریافت کد رهگیری
              </Link>
              <Link
                href="/landing/contract-guarantee"
                className="text-gray-700 hover:text-teal-700"
              >
                ضمانت قرارداد چیست؟
              </Link>
            </div>
          </CollapseBox>

          <CollapseBox label="املاین" className="border-t py-2 text-sm border-b">
            <div className="flex flex-col gap-3 items-start pt-2">
              <button
                type="button"
                className="flex text-gray-700 hover:text-teal-700"
                onClick={() => scrollToTarget('faq')}
              >
                سوالات متداول
              </button>

              <button
                type="button"
                className="flex text-gray-700 hover:text-teal-700"
                onClick={() => setIsSupportModalOpen(true)}
              >
                ارتباط با ما
              </button>

              <Link href="/about-us" className="text-gray-700 hover:text-teal-700">
                درباره ما
              </Link>

              <a href={publicRuntimeConfig.BLOG_URL} className="text-gray-700 hover:text-teal-700">
                بلاگ
              </a>
            </div>
          </CollapseBox>
        </div>
      )}

      {!hideTrust && <TrustItems className="my-5 px-7" />}

      {!hideInfo && (
        <div
          className={cn(
            'flex flex-col items-center p-7 bg-gradient-to-b from-[#F4F9F9] to-[#D3EBEB]',
            infoClassName
          )}
        >
          <Image src="/images/logotype.svg" alt="logo" width={100} height={38} className="mb-5" />

          {!hideSiteLink && (
            <a
              href="https://amline.ir"
              className="rounded-lg py-1.5 px-3 bg-primary text-white text-sm mb-5"
            >
              سایت املاین
            </a>
          )}

          <div className="flex items-center fa text-sm text-[#676767]">
            <PhoneIcon className="ml-2 shrink-0" style={{ transform: 'rotateY(180deg)' }} />
            تلفن پشتیبانی:
            {supportPhones.map((phone, index) => (
              <React.Fragment key={phone.value}>
                <a href={`tel:${phone.value}`} key={phone.text} className="mr-2">
                  {phone.text}
                </a>
                {supportPhones.length - 1 !== index && (
                  <span className="w-px h-[18px] bg-[#515151] mr-2" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center fa text-center text-sm text-[#676767] mt-1">
            <LocationIcon className="ml-2 shrink-0" />
            نشانی: {COMPANY_ADDRESS}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <a href="https://eitaa.com/Amlinebime" target="_blank" rel="noreferrer">
              <EitaaIcon color="#676767" />
            </a>

            <a href="https://www.linkedin.com/company/amline-ir/" target="_blank" rel="noreferrer">
              <LinkedInIcon color="#676767" />
            </a>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
