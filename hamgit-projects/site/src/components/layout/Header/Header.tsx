import Image from 'next/image'
import Link from 'next/link'
import { env } from '@/config/env'
import { Button } from '@/components/ui/button'
import { MobileMenu } from './MobileMenu'
import { NavigationMenuComponent } from './NavigationMenu'
import { LoginArrowRightCircleIcon } from '@/assets/icons'
import Logo from '@/../public/logo.svg'

const menuItem = [
  { key: '1', title: 'ایجاد قرارداد', href: `${env.APP_URL}/contracts/new` },
  { key: '2', title: 'محاسبه کمیسیون', href: `${env.APP_URL}/commission/calculate` },
  { key: '3', title: 'وبلاگ', href: `${env.BASE_URL}/blog` },
  {
    key: '4',
    title: 'استعلام ها',
    children: [
      {
        key: '4-1',
        title: 'استعلام سند',
        target: '_blank' as const,
        href: 'https://my.ssaa.ir/portal/ssar/originality-document',
      },
      {
        key: '4-2',
        title: 'استعلام ملک',
        target: '_blank' as const,
        href: 'https://my.ssaa.ir/portal/ssar/request-status',
      },
      { key: '4-3', title: 'استعلام قرارداد', href: `${env.APP_URL}/contracts/inquiry` },
    ],
  },
]

export const Header = () => (
  <header className="sticky top-0 right-0 left-0 z-30 bg-white shadow-md">
    <div className="container flex h-(--header-height) items-center max-lg:justify-between">
      <MobileMenu items={menuItem} />

      <Link href="/">
        <Image src={Logo} alt="Amline Logo" fetchPriority="high" priority />
      </Link>

      <NavigationMenuComponent items={menuItem} />

      <div className="flex items-center lg:mr-auto">
        <Button variant="secondary" className="flex items-center gap-1.5 max-md:size-9" asChild>
          <a href={`${env.APP_URL}/auth`}>
            <LoginArrowRightCircleIcon className="size-5" />
            <span className="max-md:hidden">ورود یا ثبت‌نام</span>
          </a>
        </Button>

        <span className="mr-4 h-6 w-px rounded-full bg-gray-200 max-lg:hidden" />

        <Button variant="ghost" className="hover:bg-transparent max-lg:hidden" asChild>
          <Link href="https://admin.amline.ir">ورود به پنل مشاور املاک</Link>
        </Button>
      </div>
    </div>
  </header>
)
