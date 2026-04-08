'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

// Images
import contractImg1 from '../assets/images/contract-1.webp'
import contractImg2 from '../assets/images/contract-2.webp'
import contractImg3 from '../assets/images/contract-3.webp'
import contractImg4 from '../assets/images/contract-4.webp'
import contractImg5 from '../assets/images/contract-5.webp'

// Types
import { type UseEmblaCarouselType } from 'embla-carousel-react'
type CarouselApi = UseEmblaCarouselType[1]

const TWEEN_FACTOR_BASE = 0.2
const SLIDES = [contractImg1, contractImg2, contractImg3, contractImg4, contractImg5]

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max)

export const SampleContract = ({ className }: { className?: string }) => {
  const [api, setApi] = useState<CarouselApi>()
  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])

  const setTweenNodes = useCallback((emblaApi: CarouselApi): void => {
    tweenNodes.current = emblaApi!.slideNodes().map(slideNode => {
      return slideNode.querySelector('#contract-sample') as HTMLElement
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi: CarouselApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi!.scrollSnapList().length
  }, [])

  const tweenScale = useCallback((emblaApi: CarouselApi, eventName?: string) => {
    const engine = emblaApi!.internalEngine()
    const scrollProgress = emblaApi!.scrollProgress()
    const slidesInView = emblaApi!.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi!.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach(slideIndex => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach(loopItem => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const scale = numberWithinRange(tweenValue, 0, 1).toString()
        const tweenNode = tweenNodes.current[slideIndex]
        tweenNode.style.transform = `scale(${scale})`
      })
    })
  }, [])

  useEffect(() => {
    if (!api) return

    setTweenNodes(api)
    setTweenFactor(api)
    tweenScale(api)

    api
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  return (
    <section className={cn('container md:px-12', className)} id="contractsSample">
      <h2 className="mb-10 text-center font-bold text-gray-800 sm:mb-13 sm:text-lg md:mb-16 md:text-xl lg:text-2xl">
        نمونه قرارداد آنلاین در املاین
      </h2>

      <Carousel opts={{ loop: true, direction: 'rtl' }} setApi={setApi}>
        <CarouselContent className="ml-0 py-2">
          {SLIDES.map((img, id) => (
            <CarouselItem
              // eslint-disable-next-line react/no-array-index-key
              key={id}
              className="basis-1/2 pl-0 lg:basis-1/3"
            >
              <div
                id="contract-sample"
                className="relative aspect-40/56 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)]"
              >
                <Image src={img} alt="نمونه قرارداد" fill className="object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
