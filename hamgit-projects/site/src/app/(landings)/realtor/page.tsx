import type { Metadata } from 'next'
import { RealtorPage } from '@/features/landing'

export const metadata: Metadata = {
  title: 'مشاور املاک',
  description: 'قرارداد اجاره و رهن خود را به صورت آنلاین، سریع و امن در بستر املاین بنویسید',
  alternates: { canonical: '/realtor' },
}

export default function Realtor() {
  return <RealtorPage />
}
