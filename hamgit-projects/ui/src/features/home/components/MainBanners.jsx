import Link from 'next/link'
import Image from 'next/image'

import banner01 from '@/assets/images/home-banners/main-01.png'

function MainBanners({ className }) {
  return (
    <div className={className}>
      <Link
        href="/landing/contract-guarantee"
        className="relative block w-full aspect-[344/230] rounded-3xl overflow-hidden"
      >
        <Image
          className="object-contain"
          src={banner01.src}
          fetchPriority="high"
          sizes="100vw"
          fill
        />
      </Link>
    </div>
  )
}

export default MainBanners
