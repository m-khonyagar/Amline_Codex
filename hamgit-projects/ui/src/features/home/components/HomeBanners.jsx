import banner02 from '@/assets/images/home-banners/02.png'
import banner03 from '@/assets/images/home-banners/03.png'
import banner04 from '@/assets/images/home-banners/04.png'
import SlideBanners from './SlideBanners'
import { cn } from '@/utils/dom'

const SLIDES = [
  {
    id: 1,
    image: banner02.src,
    path: '/landing/phone-tracking-code',
  },
  {
    id: 3,
    image: banner03.src,
    path: '',
  },
  {
    id: 4,
    image: banner04.src,
    path: '',
  },
]

function HomeBanners({ className }) {
  return (
    <section className={cn(className)}>
      <SlideBanners slides={SLIDES} autoplayOptions={{ delay: 2000 }} />
    </section>
  )
}

export default HomeBanners
