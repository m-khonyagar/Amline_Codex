import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/dom'

import upImg from '@/assets/images/up.svg'
import exportImg from '@/assets/images/export.svg'
import paymentImg from '@/assets/images/payment.svg'
import historyImg from '@/assets/images/history.svg'
import reloadImg from '@/assets/images/reload.svg'
import keyImg from '@/assets/images/key.svg'
import cardManagementImg from '@/assets/images/card-management.svg'
import invoiceImg from '@/assets/images/invoice.svg'

const navigation = [
  {
    id: 1,
    enabled: false,
    title: 'افزایش موجودی',
    image: upImg.src,
    link: '/wallet/charge',
  },
  {
    id: 2,
    enabled: false,
    title: 'برداشت/ انتقال',
    image: exportImg.src,
    link: '/wallet/withdrawal',
  },
  {
    id: 3,
    enabled: true,
    title: 'صورت‌حساب',
    image: invoiceImg.src,
    link: '/wallet/transactions',
  },
  {
    id: 4,
    enabled: true,
    title: 'سابقه درخواست',
    image: historyImg.src,
    link: '/wallet/settlements',
  },
  {
    id: 5,
    enabled: false,
    title: 'پرداخت خودکار',
    image: reloadImg.src,
    link: '/',
  },
  {
    id: 6,
    enabled: false,
    title: 'رمز دوم پویا',
    image: keyImg.src,
    link: '/',
  },
  {
    id: 7,
    enabled: false,
    title: 'مدیریت کارت',
    image: cardManagementImg.src,
    link: '/',
  },
  {
    id: 8,
    enabled: false,
    title: 'پرداخت ها',
    image: paymentImg.src,
    link: '/',
  },
]

function WalletHomeNavigation() {
  return (
    <div className="grid grid-cols-4 gap-y-3 gap-x-2">
      {navigation.map((nav) => (
        <NavigationItem key={nav.id} {...nav} />
      ))}
    </div>
  )
}

function NavigationItem({ link, image, title, enabled, rel }) {
  const Comp = enabled ? Link : 'div'

  return (
    <Comp
      href={enabled ? link : undefined}
      target={link?.indexOf('https://') !== -1 ? '_blank' : undefined}
      rel={rel}
      className="flex flex-col items-center gap-2 text-xs text-center text-nowrap"
    >
      <div
        className={cn(
          'bg-white rounded-lg w-[65px] h-[62px] border border-gray-200 flex items-center justify-center',
          {
            grayscale: !enabled,
            'shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]': enabled,
          }
        )}
      >
        <Image width={30} height={36} src={image} alt="" />
      </div>

      {title}
    </Comp>
  )
}

export default WalletHomeNavigation
