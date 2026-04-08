'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronRightIcon } from '@/assets/icons'

export function BackToAppButton() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title')

  if (title !== 'backurl') {
    return null
  }

  return (
    <Link
      href="https://app.amline.ir/"
      className="fixed top-30 right-4 z-50 flex items-center gap-1 rounded-full bg-orange-400 px-3 py-1.5 text-xs text-white shadow-md"
    >
      <ChevronRightIcon className="size-4" />
      بازگشت به برنامه املاین
    </Link>
  )
}
