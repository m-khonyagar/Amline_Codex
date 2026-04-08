import React from 'react'
import SlideBanners from './SlideBanners'
import { cn } from '@/utils/dom'
import banner1 from '@/assets/images/home-banners/vadie.png'
import banner2 from '@/assets/images/home-banners/hotest.png'
import banner3 from '@/assets/images/home-banners/request_vadie.png'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'

const SLIDES = [
  {
    id: 1,
    image: banner1.src,
    path: `${publicRuntimeConfig.BLOG_URL}/vam-vedie-maskan/`,
  },
  {
    id: 2,
    image: banner2.src,
    path: publicRuntimeConfig.BLOG_URL,
  },
  {
    id: 3,
    image: banner3.src,
    path: 'https://b2n.ir/a51638',
    target: '_blank',
  },
]

function BlogBanners({ className }) {
  return (
    <section className={cn(className)}>
      <SlideBanners slides={SLIDES} autoplayOptions={{ delay: 2500 }} />
    </section>
  )
}

export default BlogBanners
