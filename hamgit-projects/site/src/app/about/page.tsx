import type { Metadata } from 'next'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { ChevronDoubleDown } from '@/assets/icons'

import NeshanImage from '@/assets/images/neshan.png'
import BaladImage from '@/assets/images/balad.png'
import GoogleMapsImage from '@/assets/images/google-maps.png'

const teamMembers = [
  {
    key: '1',
    name: 'محمد خنیاگر',
    role: 'هم بنیان‌گذار و رئیس هیات مدیره',
    image: '',
  },
  {
    key: '2',
    name: 'محسن خنیاگر',
    role: 'هم بنیان‌گذار',
    image: '',
  },
  {
    key: '3',
    name: 'منصوره کیبری ارانی',
    role: 'هم بنیان‌گذار و مدیر عامل',
    image: '',
  },
  {
    key: '4',
    name: 'محمد علی سلطانی پور',
    role: 'مدیر فنی',
    image: '',
  },
]

export const metadata: Metadata = {
  title: 'درباره ما',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex h-72 items-center justify-center sm:h-[580px] lg:h-[780px]">
        <Image
          src="/images/banners/tawheed-tunnel.webp"
          className="z-0 object-cover"
          alt="Hero Background"
          fetchPriority="high"
          priority
          fill
        />

        <div className="absolute inset-0 z-1 flex flex-col items-center justify-center gap-10 bg-black/70 p-10 sm:gap-24 lg:gap-32">
          <div className="relative aspect-8/3 w-28 sm:w-[280px] lg:w-[400px]">
            <Image src="/logo.svg" alt="Logo" fill />
          </div>

          <p className="max-w-3xl text-center text-sm font-medium text-white sm:text-xl sm:font-black lg:text-2xl">
            املاین یک املاک امن و آنلاین به وسعت کل کشوره که امکان بستن قرارداد رهن و اجاره‌‌ و خرید
            و فروش به‌صورت آنلاین رو برای مخاطبان فراهم کرده.
          </p>

          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <span className="text-sm font-medium text-white sm:text-xl sm:font-black lg:text-2xl">
              ببین املاین چیا داره:
            </span>
            <ChevronDoubleDown className="size-5 text-[#B7B7B7] sm:size-8 lg:size-10" />
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="container mt-20 text-center">
        <h1 className="mb-6 text-center text-3xl font-medium">درباره ما</h1>

        <p className="fa leading-loose text-black">
          شما می‌تونید قرارداد ملکی‌تون رو به‌صورت برخط، سریع و آسون در بستر املاین بنویسید و کد
          رهگیری دریافت کنید. قراردادهایی که تو املاین نوشته می‌شن، اول کارشناسای حقوقی ما بررسی
          می‌کنن و بعد براش کد رهگیری دریافت می‌کنن. شرکت تحلیل آوران املاک روز (املاین) به شماره
          ثبت 21567 تلاش می‌کنه تا همه‌ی خدمات در مورد ملک رو که مردم با مراجعه‌ی حضوری دفاتر و
          سازمان‌های مربوطه مثل دفتر املاک دریافت می‌کنن به‌صورت مجازی و برخط، ارائه بده. هدف‌مون هم
          اینه که تجربه‌ی متفاوت و دسترسی بهتری رو به امکاناتی مثل انعقاد قرارداد، ثبت آگهی و
          نیازمندی، استعلامات برخط، محاسبه کمیسیون قانونی و … برای شما کاربران فراهم کنیم.
        </p>
      </section>

      {/* Team Members */}
      <section className="container mt-32">
        <h2 className="mb-10 text-center text-3xl font-medium">تیم املاین</h2>

        <div className="flex flex-wrap justify-around gap-y-10 sm:gap-8 lg:gap-y-12">
          {teamMembers.map(member => (
            <div key={member.key} className="flex w-1/2 flex-col items-center px-1 sm:w-44 lg:w-56">
              <div className="relative mb-2 size-24 overflow-hidden rounded-full bg-gray-200 sm:size-36 lg:size-48">
                {member.image ? (
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    {/* Placeholder icon */}
                    <span className="text-xl sm:text-2xl lg:text-4xl">?</span>
                  </div>
                )}
              </div>
              <div className="text-center text-sm font-medium sm:text-base lg:text-xl">
                {member.name}
              </div>
              <div className="text-center text-sm text-gray-600 sm:text-base lg:text-xl">
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="container mt-40 mb-30">
        <div className="mx-auto lg:w-5/6">
          <h2 className="mb-6 text-center text-3xl font-medium">محل شرکت املاین</h2>

          <div className="aspect-532/235 w-full overflow-hidden rounded-xl border border-neutral-500">
            <iframe
              title="محل شرکت املاین در گوگل مپ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d210.7828466351586!2d50.85818633013699!3d34.612612931570226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f93bd004116111f%3A0x4c53899bb5ae7fb8!2z2KfZhdmE2KfbjNmG!5e0!3m2!1sfa!2s!4v1752920907804!5m2!1sfa!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <a href={siteConfig.address.mapLink} target="_blank">
              <Image src={GoogleMapsImage} width={50} height={50} alt="گوگل مپ" />
            </a>

            <a href={siteConfig.address.neshanLink} target="_blank">
              <Image src={BaladImage} width={50} height={50} alt="بلد" className="rounded-md" />
            </a>

            <a href={siteConfig.address.neshanLink} target="_blank">
              <Image src={NeshanImage} width={50} height={50} alt="نشان" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
