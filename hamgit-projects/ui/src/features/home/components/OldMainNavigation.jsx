import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/dom'

import mashinetImg from '@/assets/images/mashinet.svg'
import homeUserImg from '@/assets/images/home_user.svg'
import commercialImg from '@/assets/images/commercial.svg'
import calculatorImg from '@/assets/images/calculator.svg'
import signContractImg from '@/assets/images/sign_contract.svg'
import inquiryChequeImg from '@/assets/images/inquiry_cheque.svg'
import bubbleQuestionImg from '@/assets/images/bubble_question.svg'
import inquiryDocumentImg from '@/assets/images/inquiry_document.svg'
import inquiryContractImg from '@/assets/images/inquiry_contract.svg'
import contractGuaranteeImg from '@/assets/images/contract_guarantee.svg'
import inquiryCriminalImg from '@/assets/images/inquiry_criminal.svg'
import inquiryPropertyImg from '@/assets/images/inquiry_property.svg'

const navigation = [
  {
    id: 1,
    enabled: true,
    title: 'انعقاد قرارداد',
    image: signContractImg.src,
    link: '/contracts',
  },
  {
    id: 2,
    enabled: true,
    title: 'محاسبه کمیسیون',
    image: calculatorImg.src,
    link: '/commission/calculate',
  },
  {
    id: 3,
    enabled: true,
    title: 'ثبت آگهی',
    image: commercialImg.src,
    link: '/ads/new',
  },
  {
    id: 4,
    enabled: true,
    title: 'ثبت نیازمندی‌ها',
    image: bubbleQuestionImg.src,
    link: '/requirements/new',
  },
  {
    id: 5,
    enabled: true,
    title: 'استعلام ملک',
    image: inquiryPropertyImg.src,
    link: 'https://my.ssaa.ir/portal/ssar/request-status',
    rel: 'nofollow',
  },
  {
    id: 6,
    enabled: true,
    title: 'استعلام سند',
    image: inquiryDocumentImg.src,
    link: 'https://my.ssaa.ir/portal/ssar/originality-document',
    rel: 'nofollow',
  },
  {
    id: 7,
    enabled: true,
    title: 'استعلام چک',
    image: inquiryChequeImg.src,
    link: 'https://www.cbi.ir/EstelamSayad/24090.aspx',
    rel: 'nofollow',
  },
  {
    id: 8,
    enabled: false,
    title: 'استعلام کیفری',
    image: inquiryCriminalImg.src,
    link: '',
    rel: 'nofollow',
  },
  {
    id: 9,
    enabled: true,
    title: 'استعلام قرارداد',
    image: inquiryContractImg.src,
    link: '/contracts/inquiry',
    rel: 'nofollow',
  },
  {
    id: 10,
    enabled: true,
    title: 'ضمانت قرارداد',
    image: contractGuaranteeImg.src,
    link: 'landing/contract-guarantee',
    rel: 'nofollow',
  },
  // {
  //   id: 11,
  //   enabled: false,
  //   title: 'املاک سیار',
  //   image: homeUserImg.src,
  // },
  {
    id: 12,
    enabled: true,
    title: 'املاک تلفنی',
    link: 'landing/phone-property-consult',
    image: homeUserImg.src,
  },
  {
    id: 13,
    enabled: true,
    title: 'ماشینت',
    link: 'landing/mashinet',
    image: mashinetImg.src,
  },
]

function OldMainNavigation() {
  return (
    <div className="px-4 grid grid-cols-4 gap-y-3 gap-x-2">
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
      <Image
        width={45}
        height={45}
        src={image}
        alt=""
        className={cn('bg-white p-2 rounded-lg w-[65px] h-[62px] border border-gray-200', {
          grayscale: !enabled,
          'shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]': enabled,
        })}
      />
      {title}
    </Comp>
  )
}

export default OldMainNavigation
