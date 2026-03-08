'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
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

  return { selectedIndex, scrollSnaps }
}

export default function Slider({ options = DEFAULT_OPTIONS, autoplayOptions = null, children }) {
  const plugins = []
  if (autoplayOptions) plugins.push(Autoplay(autoplayOptions))

  const [emblaRef, emblaApi] = useEmblaCarousel({ ...DEFAULT_OPTIONS, ...options }, plugins)
  const { selectedIndex, scrollSnaps } = useDotButton(emblaApi)

  return (
    <div className="overflow-hidden relative w-full h-full" ref={emblaRef}>
      <div className="flex h-full">{children}</div>

      <div className="absolute flex gap-1 left-1/2 bottom-1.5 -translate-x-2/4 z-10 bg-gray-900 bg-opacity-10  px-[2px] py-[2px] rounded-md">
        {scrollSnaps.map((snap, index) => (
          <span
            key={snap}
            className={cn(
              'block w-1 h-1 rounded-full',
              index === selectedIndex ? 'bg-white' : 'bg-white/50'
            )}
          />
        ))}
      </div>
    </div>
  )
}
