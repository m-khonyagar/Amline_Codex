import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-[calc(100vh-var(--header-height))] items-center justify-center bg-white"
      style={{
        backgroundImage: 'url(/images/banners/city-skyline.webp)',
        backgroundPosition: 'bottom',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex flex-col items-center justify-center px-4">
        <h1 className="mb-5 text-5xl font-bold text-gray-800 sm:mb-9 sm:text-7xl">404</h1>

        <p className="mb-10 text-center font-medium text-gray-800 sm:mb-16 sm:text-xl lg:text-2xl">
          صفحه پیدا نشد :( <br /> صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است جابه‌جا شده
          باشد.
        </p>

        <Button asChild>
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </Button>
      </div>
    </div>
  )
}
