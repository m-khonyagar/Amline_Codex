import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import TypographyLogo from '@/../public/typography.svg'

export const HeroV2 = () => (
  <section className="relative h-[calc(100vh-var(--header-height))] bg-linear-to-b from-black/60 to-black/80">
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/images/hero-poster.webp"
      className="absolute top-0 left-0 -z-10 h-full w-full object-cover"
    >
      <source src="/videos/hero.webm" type="video/webm" />
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>

    <div className="absolute bottom-1/6 left-1/2 container flex -translate-x-1/2 flex-col items-center gap-8">
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-white">در</span>
        <Image src={TypographyLogo} alt="املاین" fetchPriority="high" priority />
      </div>

      <p className="text-center text-3xl leading-10 font-bold text-white">
        برای ملکت امن، آنلاین و ارزان قرارداد بنویس!
      </p>

      <div className="flex items-center justify-center gap-5">
        <Button className="cursor-pointer whitespace-nowrap" asChild>
          <Link href="/rent">قرارداد رهن و اجاره</Link>
        </Button>

        <Button variant="outline" className="cursor-pointer whitespace-nowrap">
          <Link href="/realtor">پنل مشاوران املاک</Link>
        </Button>
      </div>
    </div>
  </section>
)
