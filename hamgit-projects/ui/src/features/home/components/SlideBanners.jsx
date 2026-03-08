import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/utils/dom'

const DEFAULT_OPTIONS = { direction: 'rtl', loop: true }

const useDotButton = (emblaApi) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const onInit = useCallback((api) => {
    setScrollSnaps(api.scrollSnapList())
  }, [])

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
  }
}

function SlideItem({ path, image, target }) {
  const Comp = path ? 'a' : 'div'
  return (
    <Comp href={path} target={target || '_self'} className="min-w-0 flex-[0_0_100%] mx-2.5">
      <Image
        width={680}
        height={200}
        quality={100}
        className="mx-auto size-full"
        src={image}
        alt="banner"
        loading="eager"
      />
    </Comp>
  )
}

function SlideBanners({ slides = [], options = DEFAULT_OPTIONS, autoplayOptions = null }) {
  const plugins = []
  if (autoplayOptions) {
    plugins.push(Autoplay(autoplayOptions))
  }
  const [emblaRef, emblaApi] = useEmblaCarousel({ ...DEFAULT_OPTIONS, ...options }, plugins)

  const { selectedIndex, scrollSnaps } = useDotButton(emblaApi)

  return (
    <div className="overflow-hidden relative" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide) => (
          <SlideItem key={slide.id} {...slide} />
        ))}
      </div>
      <div className="absolute flex gap-1 left-1/2 bottom-1.5 -translate-x-2/4">
        {scrollSnaps.map((_, index) => (
          <span
            key={_}
            className={cn(
              'block w-1.5 h-1.5 rounded-full',
              index === selectedIndex ? 'bg-white' : 'bg-white/50'
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default SlideBanners
