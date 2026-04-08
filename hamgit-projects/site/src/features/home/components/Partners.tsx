'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { ShieldCheckIcon } from '@/assets/icons'

import melliPelastLogo from '@/assets/images/home/melli-pelast.webp'
import journeyLogo from '@/assets/images/home/journey.webp'
import basalamLogo from '@/assets/images/home/basalam.webp'
import tankLogo from '@/assets/images/home/tank.webp'
import catrinPelastLogo from '@/assets/images/home/catrin-pelast.webp'

const partners = [
  { id: 1, src: melliPelastLogo, alt: 'ملی پلاست' },
  { id: 2, src: journeyLogo, alt: 'جرنی' },
  { id: 3, src: basalamLogo, alt: 'باسلام' },
  { id: 4, src: tankLogo, alt: 'تانک' },
  { id: 5, src: catrinPelastLogo, alt: 'کاترین پلاست' },
]

export const Partners = ({ className }: { className?: string }) => (
  <section className={cn('container', className)}>
    <div className="flex flex-col items-center">
      <h3 className="mb-8 text-3xl font-medium text-black">همکاران املاین:</h3>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
          direction: 'rtl',
          breakpoints: { '(min-width: 768px)': { active: false } },
        }}
        plugins={[Autoplay({ delay: 2500 })]}
        className="mb-14 w-full max-w-5xl"
      >
        <CarouselContent className="lg:-ml-9">
          {partners.map(logo => (
            <CarouselItem
              key={logo.id}
              className="basis-1/3 max-[450px]:basis-1/2 sm:basis-1/4 md:basis-1/5 lg:pl-9"
            >
              <div className="relative aspect-square grayscale transition-all duration-300 select-none hover:grayscale-0">
                <Image
                  fill
                  src={logo.src}
                  alt={logo.alt}
                  className="object-cover"
                  sizes="(max-width: 450px) 50vw, (max-width: 640px) 25vw, 20vw"
                  priority={false}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Button
        size="lg"
        asChild
        className="cursor-pointer bg-linear-to-l from-[#048DB7] to-[#01556F] font-medium shadow-[#0B3F71]"
      >
        <Link href="/licenses">
          <ShieldCheckIcon />
          مشاهده مجوز ها و تاییدیه های املاین
        </Link>
      </Button>
    </div>
  </section>
)
