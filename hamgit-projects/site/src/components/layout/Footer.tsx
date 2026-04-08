import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { env } from '@/config/env'
import { cn } from '@/lib/utils'
import { EitaaIcon, LinkedinIcon } from '@/assets/icons'

const footerLinks = [
  {
    title: 'راهنما',
    links: [
      { label: 'راهنمای انعقاد قرارداد', href: `${env.APP_URL}/guide/contract` },
      { label: 'نحوه محاسبه کمیسیون', href: `${env.APP_URL}/commission/calculate` },
      { label: 'روند دریافت کد رهگیری', href: `${env.APP_URL}/landing/phone-tracking-code` },
      { label: 'ضمانت قرارداد چیست؟', href: `${env.APP_URL}/landing/contract-guarantee` },
    ],
  },
  {
    title: 'املاین',
    links: [
      { label: 'قوانین و مقررات', href: `${env.APP_URL}/terms` },
      { label: 'درباره ما', href: '/about' },
      { label: 'بلاگ', href: `${env.BASE_URL}/blog` },
      { label: 'مجوز ها', href: '/licenses' },
    ],
  },
]

export const Footer = ({ className }: { className?: string }) => (
  <footer className={cn('bg-sky-950 text-white', className)}>
    <div className="container">
      <div className="py-10">
        <Link href="/" className="inline-block">
          <Image src="/logo.svg" alt="لوگو املاین" width={114} height={43} />
        </Link>
      </div>

      <div className="grid gap-x-4 gap-y-12 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {footerLinks.map(section => (
            <div className="space-y-5" key={section.title}>
              <div className="relative pb-2 text-xs font-medium sm:text-sm">
                {section.title}
                <span className="absolute right-0 bottom-0 h-0.5 w-10 bg-white" />
              </div>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {section.links.map(link => {
                  const isInternal = link.href.startsWith('/')

                  return (
                    <li key={link.label}>
                      {isInternal ? (
                        <Link
                          href={link.href}
                          className="hover:text-primary text-xs text-stone-300 transition-all sm:text-sm"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="hover:text-primary text-xs text-stone-300 transition-all sm:text-sm"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          <div className="space-y-5 max-sm:col-span-full">
            <div className="relative pb-2 text-xs font-medium sm:text-sm">
              دفتر املاین
              <span className="absolute right-0 bottom-0 h-0.5 w-10 bg-white" />
            </div>

            <div className="aspect-3/2 w-full overflow-hidden border border-neutral-500">
              <iframe
                title="محل شرکت املاین در گوگل مپ"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.4428778569245!2d50.8123231!3d34.5676588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f93a300086b1331%3A0x1d6a7f3ac0890e2c!2z2KfZhdmE2KfbjNmG!5e0!3m2!1sfa!2s!4v1770545867050!5m2!1sfa!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="lg:pr-10">
          <div className="flex justify-between gap-4">
            <div>
              <div className="fa text-xs text-stone-300 sm:mb-2 sm:text-sm">
                تلفن پشتیبانی:{' '}
                {siteConfig.phones.map((phone, index) => (
                  <span key={phone.number}>
                    <a
                      key={phone.link}
                      href={phone.link}
                      dir="ltr"
                      className="hover:text-primary transition-all"
                    >
                      {phone.number}
                    </a>
                    {index !== siteConfig.phones.length - 1 && ' | '}
                  </span>
                ))}
              </div>
              <div className="fa text-xs text-stone-300 sm:text-sm">
                نشانی: {siteConfig.address.value}
              </div>
            </div>

            <div className="flex gap-2 text-stone-300">
              <a
                href={siteConfig.social.eitaa}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-all"
              >
                <EitaaIcon className="size-5 sm:size-6" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-all"
              >
                <LinkedinIcon className="size-5 sm:size-6" />
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 max-lg:justify-center">
            <a
              referrerPolicy="origin"
              target="_blank"
              className="size-20 p-2.5 lg:size-24"
              href="https://trustseal.enamad.ir/?id=524391&Code=9fA6nZkpehUfNt7ttNlwrcEwrlmzlJlh"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                referrerPolicy="origin"
                src="https://reg2.enamad.ir/rc/outResource/dist/img/logopng/110.png"
                alt="نماد اعتماد الکترونیک"
                style={{ cursor: 'pointer' }}
                className="size-full bg-transparent object-contain"
                // @ts-expect-error Code is necessary for the image to load
                code="9fA6nZkpehUfNt7ttNlwrcEwrlmzlJlh"
              />
            </a>

            <div className="size-20 p-2.5 lg:size-24">
              <div className="relative size-full">
                <Image
                  fill
                  className="object-contain"
                  src="/images/footer/kasbokar.png"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt="اتحادیه کشوری کسب و کارهای مجازی"
                />
              </div>
            </div>

            <div className="size-20 p-2.5 lg:size-24">
              <div className="relative size-full">
                <Image
                  fill
                  className="object-contain"
                  src="/images/footer/amlak.png"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt="اتحادیه صنف مشاورین املاک"
                />
              </div>
            </div>

            <div className="size-20 p-2.5 lg:size-24">
              <div className="relative size-full">
                <Image
                  fill
                  className="object-contain"
                  src="/images/footer/senf.png"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt="سازمان نظام صنفی رایانه ای کشور"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 pb-5">
        <p className="text-center text-xs text-stone-300">
          تمامی حقوقی مادی و معنوی این صفحه متعلق به شرکت تحلیل آوران املاک روز می‌باشد.
        </p>
      </div>
    </div>
  </footer>
)

// <footer className={cn('bg-sky-950 text-white', className)}>
//   <div className="pt-12 pb-24">
//     <div className="container flex gap-4 max-md:flex-col max-md:gap-16">
//       <div className="flex flex-1 flex-wrap gap-x-16 gap-y-10">
//         {footerLinks.map(section => (
//           <div key={section.title}>
//             <p className="mb-4">{section.title}</p>
//             <ul className="flex flex-col items-stretch gap-4 text-sm text-stone-300">
//               {section.links.map(link => {
//                 const isInternal = link.href.startsWith('/')

//                 return (
//                   <li key={link.label}>
//                     {isInternal ? (
//                       <Link href={link.href} className="block transition hover:text-primary">
//                         {link.label}
//                       </Link>
//                     ) : (
//                       <a
//                         href={link.href}
//                         className="block transition hover:text-cyan-400"
//                         rel="noreferrer"
//                       >
//                         {link.label}
//                       </a>
//                     )}
//                   </li>
//                 )
//               })}
//             </ul>
//           </div>
//         ))}
//       </div>

//       <div className="flex-1">
//         <div className="mb-10 flex flex-wrap items-center gap-3 max-md:justify-center lg:gap-6">
//           <a
//             referrerPolicy="origin"
//             target="_blank"
//             className="size-[80px] rounded-[20px] border border-stone-300 p-2.5 lg:size-[100px]"
//             href="https://trustseal.enamad.ir/?id=524391&Code=9fA6nZkpehUfNt7ttNlwrcEwrlmzlJlh"
//           >
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               referrerPolicy="origin"
//               src="https://trustseal.enamad.ir/logo.aspx?id=524391&Code=9fA6nZkpehUfNt7ttNlwrcEwrlmzlJlh"
//               alt="نماد اعتماد الکترونیک"
//               style={{ cursor: 'pointer' }}
//               className="size-full bg-transparent object-contain"
//               // @ts-expect-error Code is necessary for the image to load
//               code="9fA6nZkpehUfNt7ttNlwrcEwrlmzlJlh"
//             />
//           </a>

//           <div className="size-[80px] rounded-[20px] border border-stone-300 p-2.5 lg:size-[100px]">
//             <div className="relative size-full">
//               <Image
//                 fill
//                 className="object-contain"
//                 src="/images/footer/kasbokar.png"
//                 sizes="(max-width: 768px) 100vw, 33vw"
//                 alt="اتحادیه کشوری کسب و کارهای مجازی"
//               />
//             </div>
//           </div>

//           <div className="size-[80px] rounded-[20px] border border-stone-300 p-2.5 lg:size-[100px]">
//             <div className="relative size-full">
//               <Image
//                 fill
//                 className="object-contain"
//                 src="/images/footer/amlak.png"
//                 sizes="(max-width: 768px) 100vw, 33vw"
//                 alt="اتحادیه صنف مشاورین املاک"
//               />
//             </div>
//           </div>

//           <div className="size-[80px] rounded-[20px] border border-stone-300 p-2.5 lg:size-[100px]">
//             <div className="relative size-full">
//               <Image
//                 fill
//                 className="object-contain"
//                 src="/images/footer/senf.png"
//                 sizes="(max-width: 768px) 100vw, 33vw"
//                 alt="سازمان نظام صنفی رایانه ای کشور"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col gap-4 text-sm max-md:items-center">
//           <div className="text-stone-300">
//             <div className="flex items-center gap-3">
//               <PhoneIcon className="size-6 shrink-0 rotate-y-180" />
//               <div className="fa">
//                 تلفن پشتیبانی:{' '}
//                 {siteConfig.phones.map((phone, index) => (
//                   <Fragment key={phone.number}>
//                     <a key={phone.link} href={phone.link} dir="ltr">
//                       {phone.number}
//                     </a>
//                     {index !== siteConfig.phones.length - 1 && ' | '}
//                   </Fragment>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="text-stone-300">
//             <div className="flex items-center gap-3">
//               <MapPinIcon className="size-6 shrink-0" />
//               <div className="fa">نشانی: {siteConfig.address.value}</div>
//             </div>
//           </div>

//           <div className="text-stone-300">
//             <div className="flex items-center gap-3">
//               <GlobeIcon className="size-6 shrink-0" />
//               ما را در شبکه های اجتماعی دنبال کنید:
//               <a href={siteConfig.social.eitaa} target="_blank" rel="noreferrer">
//                 <EitaaIcon className="size-6" />
//               </a>
//               <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
//                 <LinkedinIcon className="size-6" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>

//   <div className="border-t border-stone-300 p-4 text-center text-sm">
//     <p className="text-white">
//       تمامی حقوقی مادی و معنوی این صفحه متعلق به شرکت{' '}
//       <span className="text-primary">تحلیل آوران املاک روز</span> میباشد.
//     </p>
//   </div>
// </footer>
