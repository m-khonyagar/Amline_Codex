'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface TopBannerProps {
  houseImageSrc: string
  height?: number
}

const messages = [
  'می‌خوای قرارداد رهن و اجاره بنویسی ؟',
  'فقط با 290 هزار تومان قرارداد اجاره بنویس !',
]
const DISCOUNT_CODE = 'ErbxZe2'

export function TopBanner({ houseImageSrc, height = 90 }: TopBannerProps) {
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [mounted])

  const isDiscount = index === 1

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE)
      toast.success('کد تخفیف با موفقیت کپی شد !')
    } catch (_err) {
      toast.error('مشکلی در کپی کردن کد پیش آمد .')
    }
  }

  return (
    <div
      className="relative flex w-full cursor-pointer items-center justify-between overflow-hidden px-4 sm:px-8"
      style={{ height }}
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyDown={_e => {
        if (_e.key === 'Enter' || _e.key === ' ') handleCopy()
      }}
    >
      {/* Background رنگی */}
      <div className="absolute inset-0 bg-[#002E50]" />
      {/* عکس خونه سمت راست */}
      <div className="relative z-10 flex h-full w-28 shrink-0 flex-col justify-end sm:w-36 md:w-44">
        <div className="relative h-5/6 w-full">
          <Image
            src={houseImageSrc}
            alt="House"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>
      <div className="relative z-10 mx-auto flex items-center gap-3 sm:gap-5">
        {/* متن وسط */}
        <div className="relative z-10 flex-1 px-2 text-center">
          <h2 className="text-xs font-bold text-white transition-all duration-500 sm:text-xs md:text-lg">
            {mounted ? messages[index] : messages[0]}
          </h2>
        </div>
        {/* دکمه سمت چپ */}
        <div className="relative z-10 shrink-0">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-bold shadow transition-all duration-500 sm:text-sm ${
              isDiscount ? 'bg-red-500 text-white' : 'text-primary bg-white'
            }`}
          >
            کلیک کن
          </span>
        </div>
      </div>
    </div>
  )
}
