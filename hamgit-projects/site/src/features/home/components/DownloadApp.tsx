import Image from 'next/image'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

import mobileDownloadImg from '../assets/images/mobile-download.webp'

export const DownloadApp = ({ className }: { className?: string }) => (
  <section className={cn('container', className)}>
    <div className="flex items-center bg-sky-950 px-5 py-8 max-md:justify-center max-sm:rounded-3xl sm:rounded-bl-[40px] sm:px-8 sm:py-10 md:rounded-bl-[55px] lg:rounded-bl-[70px]">
      <div className="flex justify-center md:w-7/12">
        <div className="max-w-2xl text-white">
          <h2 className="mb-6 text-center text-xl font-bold md:text-right md:text-2xl lg:mb-8 lg:text-3xl">
            دریافت اپلیکیشن املاین
          </h2>
          <p className="mb-6 leading-7 lg:mb-10 lg:text-lg">
            با اپلیکیشن املاین به راحتی و در چند مرحله می‌توانید ملک خود را معامله کنید و قرارداد
            رسمی و قانونی ببندید.
            <br />
            برای دریافت لینک دانلود اپلیکیشن، شماره موبایل خود را وارد کنید.
          </p>
          <div className="mt-4 flex gap-3 max-md:justify-center">
            <a
              href={siteConfig.download.BAZAR}
              target="_blank"
              rel="noreferrer"
              aria-label="دانلود از بازار"
              className="max-lg:w-36"
            >
              <Image src="/images/badges/bazar.png" alt="دانلود از بازار" width={162} height={48} />
            </a>
            <a
              href={siteConfig.download.MYKET}
              target="_blank"
              rel="noreferrer"
              aria-label="دانلود از مایکت"
              className="max-lg:w-36"
            >
              <Image src="/images/badges/myket.png" alt="دانلود از مایکت" width={172} height={48} />
            </a>
          </div>
        </div>
      </div>

      <div className="flex w-5/12 shrink-0 justify-center max-md:hidden">
        <Image
          src={mobileDownloadImg}
          alt="دانلود اپلیکیشن املاین"
          className="w-52 lg:w-3xs xl:w-2xs"
        />
      </div>
    </div>
  </section>
)
