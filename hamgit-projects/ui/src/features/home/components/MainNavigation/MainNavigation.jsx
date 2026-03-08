import Image from 'next/image'
import InquiryActionItem from './InquiryActionItem'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'

// import calculatorImg from '@/assets/images/calculator.svg'
// import advertisementRequirementImg from '@/assets/images/advertisement_requirement.svg'
// import bubbleQuestionImg from '@/assets/images/bubble_question.svg'
import inquiryChequeImg from '@/assets/images/inquiry_cheque.svg'
import inquiryDocumentImg from '@/assets/images/inquiry_document.svg'
import inquiryContractImg from '@/assets/images/inquiry_contract.svg'
import inquiryPropertyImg from '@/assets/images/inquiry_property.svg'
import bgBlogImg from '@/assets/images/home-banners/blog.webp'

// const mainActions = [
//   {
//     key: 'ads',
//     title: 'آگهی ها',
//     imageSrc: advertisementRequirementImg.src,
//     href: '/ads/for_sale',
//   },
//   {
//     key: 'commission',
//     title: 'محاسبه کمیسیون',
//     imageSrc: calculatorImg.src,
//     href: '/commission/calculate',
//   },
//   {
//     key: 'requirements',
//     title: 'نیازمندی ها',
//     imageSrc: bubbleQuestionImg.src,
//     href: '/requirements?type=FOR_SALE',
//   },
// ]

const inquiryActions = [
  {
    key: 'property',
    title: 'استعلام ملک',
    image: inquiryPropertyImg.src,
    link: 'https://my.ssaa.ir/portal/ssar/request-status',
    rel: 'nofollow',
  },
  {
    key: 'document',
    title: 'استعلام سند',
    image: inquiryDocumentImg.src,
    link: 'https://my.ssaa.ir/portal/ssar/originality-document',
    rel: 'nofollow',
  },
  {
    key: 'cheque',
    title: 'استعلام چک',
    image: inquiryChequeImg.src,
    link: 'https://www.cbi.ir/EstelamSayad/24090.aspx',
    rel: 'nofollow',
  },
  {
    key: 'contract',
    title: 'استعلام قرارداد',
    image: inquiryContractImg.src,
    link: '/contracts/inquiry',
    rel: 'nofollow',
  },
]

function MainNavigation() {
  return (
    <>
      {/* <div className="px-7">
        <nav className="flex items-start gap-4 flex-nowrap mb-10">
          {mainActions.map((action) => (
            <MainActionCard
              key={action.key}
              title={action.title}
              imageSrc={action.imageSrc}
              href={action.href}
            />
          ))}
        </nav>
      </div> */}

      <a href={publicRuntimeConfig.BLOG_URL} className="relative w-full aspect-[3/1]">
        <Image src={bgBlogImg.src} alt="وبلاگ" fill style={{ objectFit: 'cover' }} sizes="100vw" />
      </a>

      <div className="px-7">
        <nav className="flex items-start justify-between sm:justify-evenly flex-nowrap mt-10">
          {inquiryActions.map((action) => (
            <InquiryActionItem
              key={action.key}
              title={action.title}
              imageSrc={action.image}
              href={action.link}
              rel={action.rel}
            />
          ))}
        </nav>
      </div>
    </>
  )
}

export default MainNavigation
