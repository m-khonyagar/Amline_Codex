import type { Metadata } from 'next'
import { RentPage } from '@/features/landing'

export const metadata: Metadata = {
  title: 'اجاره ملک',
  description: 'قرارداد اجاره و رهن خود را به صورت آنلاین، سریع و امن در بستر املاین بنویسید',
  alternates: { canonical: '/rent' },
}

export default function Rent() {
  return <RentPage />
}
