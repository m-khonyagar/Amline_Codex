import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/utils/dom'
import { createAdCategoryLink } from '../libs/adLink'

function NavigationItem({ adType, cat, image, title, enabled, rel }) {
  const Comp = enabled ? Link : 'div'
  const link = createAdCategoryLink(adType, cat)

  return (
    <Comp
      href={enabled ? link : undefined}
      rel={rel}
      className="flex flex-col items-center gap-2 text-xs text-center text-nowrap"
    >
      <Image
        width={43}
        height={45}
        src={image}
        alt=""
        className={cn('bg-white p-2 rounded-lg w-[65px] h-[60px]', {
          grayscale: !enabled,
          'shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]': enabled,
        })}
      />
      {title}
    </Comp>
  )
}

export default function AdCategoryNavigation({ items, adType }) {
  return (
    <div className="grid grid-cols-4 gap-y-3 gap-x-2">
      {items.map((nav) => (
        <NavigationItem key={nav.id} {...nav} adType={adType} />
      ))}
    </div>
  )
}
