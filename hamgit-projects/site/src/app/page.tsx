import {
  HeroV2,
  Features,
  About,
  HowToWriteContract,
  BlogPreview,
  CallToActionEndBanner,
  ContractDisputeResolution,
  DownloadApp,
  HowCanTrust,
} from '@/features/home'
import { RentDiscount } from '@/features/landing'
import { FAQ } from '@/components/FAQ'

export default function Home() {
  return (
    <>
      <HeroV2 />
      <About className="mt-28" />
      <HowToWriteContract className="mt-20 sm:mt-28 md:mt-32" />
      <HowCanTrust className="mt-20 sm:mt-28 md:mt-32" />
      <Features className="mt-20 sm:mt-28 md:mt-32" />
      <RentDiscount className="mt-20 sm:mt-28 md:mt-32" />
      <ContractDisputeResolution className="mt-20 sm:mt-28 md:mt-32" />
      <FAQ className="mt-20 sm:mt-28 md:mt-32" />
      <DownloadApp className="mt-20 sm:mt-28 md:mt-32" />
      <BlogPreview className="mt-20 sm:mt-28 md:mt-32" />
      <CallToActionEndBanner className="mt-16 mb-8 sm:mt-32 sm:mb-16" />
    </>
  )
}
