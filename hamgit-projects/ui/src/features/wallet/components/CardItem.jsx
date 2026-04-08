import Image from 'next/image'
import { cardNumberSeparator } from '@/utils/number'
import { cn } from '@/utils/dom'
import amlineCardImg from '@/assets/images/amline-card.svg'

export default function CardItem({ item, onClick, className = '' }) {
  return (
    <div
      className={cn(
        'flex items-center border-2 border-gray-200 rounded-[12px] py-1 px-2',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={() => onClick?.()}
      aria-hidden="true"
    >
      <Image src={item.icon || amlineCardImg.src} height={40} width={40} alt="" className="ml-2" />
      <span className="ml-auto">{item.name}</span>
      <span>{cardNumberSeparator(item.code, '-')}</span>
      {/* <ThreeDotsIcon className="mr-2.5 text-gray-500" /> */}
    </div>
  )
}
