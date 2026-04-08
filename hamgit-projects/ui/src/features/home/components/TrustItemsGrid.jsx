import Link from 'next/link'
import { Image } from '@/components/ui/Image'
import clock24hImg from '@/assets/images/clock_24h.svg'
import barcodeSearchImg from '@/assets/images/barcode_search.svg'
import documentSelectImg from '@/assets/images/document_select.svg'
import banknoteCuttingImg from '@/assets/images/banknote_cutting.svg'
import { cn } from '@/utils/dom'

const items = [
  {
    id: 1,
    title: (
      <>
        انعقاد قرارداد <br /> آنلاین
      </>
    ),
    image: documentSelectImg.src,
    link: null,
  },
  {
    id: 2,
    title: (
      <>
        دسترسی <br /> 24 ساعته
      </>
    ),
    image: clock24hImg.src,
    link: null,
  },
  {
    id: 3,
    title: (
      <>
        ارزان و <br /> به صرفه
      </>
    ),
    image: banknoteCuttingImg.src,
    link: null,
  },
  {
    id: 4,
    title: (
      <>
        کد رهگیری <br /> آنلاین
      </>
    ),
    image: barcodeSearchImg.src,
    link: null,
  },
]

function TrustItemsGrid({ className }) {
  return (
    <div className={cn('flex flex-wrap gap-y-8 justify-around', className)}>
      {items.map((item) => (
        <TrustItem key={item.id} {...item} />
      ))}
    </div>
  )
}

function TrustItem({ title, image, link }) {
  const Comp = link ? Link : 'div'

  return (
    <Comp
      href={link}
      className="basis-1/2 text-gray-600 flex flex-col items-center text-center gap-1 leading-relaxed fa"
    >
      <Image alt="" ratio={1} className="w-16" src={image} />
      {title}
    </Comp>
  )
}

export default TrustItemsGrid
