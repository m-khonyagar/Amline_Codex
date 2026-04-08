/* eslint-disable react/no-array-index-key */

'use client'

import useEmblaCarousel from 'embla-carousel-react'
import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/dom'

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}) {
  const [carouselRef, emblaApi] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins
  )

  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const handleSelect = React.useCallback((selectedApi) => {
    if (!selectedApi) return
    setCanScrollPrev(selectedApi.canScrollPrev())
    setCanScrollNext(selectedApi.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const handleKeyDown = React.useCallback(
    (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!emblaApi || !setApi) return
    setApi(emblaApi)
  }, [emblaApi, setApi])

  React.useEffect(() => {
    if (!emblaApi) return undefined

    handleSelect(emblaApi)
    emblaApi.on('reInit', handleSelect)
    emblaApi.on('select', handleSelect)

    return function cleanup() {
      emblaApi?.off('select', handleSelect)
    }
  }, [emblaApi, handleSelect])

  const contextValue = React.useMemo(
    () => ({
      carouselRef,
      api: emblaApi,
      opts,
      orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
    }),
    [carouselRef, emblaApi, opts, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext]
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div
        className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({ className, variant = 'outline', size = 'icon', ...props }) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? 'left-1/2 top-full -translate-x-1/2 translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({ className, variant = 'outline', size = 'icon', ...props }) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? 'right-1/2 top-full -translate-x-1/2 translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

function CarouselPagination({ className, children }) {
  const { api } = useCarousel()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState([])

  const handleDotButtonClick = React.useCallback(
    (index) => {
      if (!api) return
      api.scrollTo(index)
    },
    [api]
  )

  const handleInit = React.useCallback((currentApi) => {
    setScrollSnaps(currentApi.scrollSnapList())
  }, [])

  const handleSelect = React.useCallback((currentApi) => {
    setSelectedIndex(currentApi.selectedScrollSnap())
  }, [])

  React.useEffect(() => {
    if (!api) return undefined

    handleInit(api)
    handleSelect(api)
    api.on('reInit', handleInit).on('reInit', handleSelect).on('select', handleSelect)

    return function cleanup() {
      api?.off('reInit', handleInit).off('reInit', handleSelect).off('select', handleSelect)
    }
  }, [api, handleInit, handleSelect])

  return (
    <div className={cn('mt-5 flex items-center justify-center gap-2', className)}>
      {scrollSnaps.map((_, index) =>
        children ? (
          <React.Fragment key={index}>
            {children(index, selectedIndex, handleDotButtonClick)}
          </React.Fragment>
        ) : (
          <button
            key={index}
            type="button"
            onClick={() => handleDotButtonClick(index)}
            className={cn(
              'h-2 w-2 cursor-pointer rounded-full bg-zinc-300 transition-all',
              index === selectedIndex ? 'w-7 bg-teal-600' : ''
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        )
      )}
    </div>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselPagination,
}
