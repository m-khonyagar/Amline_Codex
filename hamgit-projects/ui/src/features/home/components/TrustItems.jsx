import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/dom'
import clock24hImg from '@/assets/images/clock_24h.svg'
import homeMedalImg from '@/assets/images/home_medal.svg'
import barcodeSearchImg from '@/assets/images/barcode_search.svg'
import banknoteCuttingImg from '@/assets/images/banknote_cutting.svg'

const items = [
  {
    id: 1,
    title: (
      <>
        دسترسی <br /> 24 ساعته
      </>
    ),
    image: clock24hImg.src,
    link: null,
    alt: 'دسترسی 24 ساعته به سامانه',
  },
  {
    id: 3,
    title: (
      <>
        کد رهگیری <br /> آنلاین
      </>
    ),
    image: barcodeSearchImg.src,
    link: null,
    alt: 'کد رهگیری آنلاین',
  },
  {
    id: 4,
    title: (
      <>
        دارای مجوز <br /> اتحادیه املاک
      </>
    ),
    image: homeMedalImg.src,
    link: null,
    alt: 'دارای مجوز اتحادیه املاک',
  },
  {
    id: 5,
    title: (
      <>
        ارزان و <br /> به صرفه
      </>
    ),
    image: banknoteCuttingImg.src,
    link: null,
    alt: 'خدمات ارزان و به صرفه',
  },
]

function TrustItem({ title, image, link, alt }) {
  const Comp = link ? Link : 'div'

  return (
    <Comp
      href={link}
      className="text-gray-600 text-sm flex flex-col items-center text-center gap-1"
    >
      <Image
        alt={alt || 'trust'}
        width={36}
        height={36}
        src={image}
        className="grayscale opacity-75"
      />
      {title}
    </Comp>
  )
}

function TrustItems({ className }) {
  return (
    <div className={cn('flex fa gap-2 justify-around', className)}>
      {items.map((item) => (
        <TrustItem key={item.id} {...item} />
      ))}
    </div>
  )
}

export default TrustItems
