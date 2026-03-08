'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/utils/dom'
import { Carousel, CarouselContent, CarouselItem } from './carousel'

// Images
import contractImg1 from '@/assets/images/home-banners/contract-1.webp'
import contractImg2 from '@/assets/images/home-banners/contract-2.webp'
import contractImg3 from '@/assets/images/home-banners/contract-3.webp'
import contractImg4 from '@/assets/images/home-banners/contract-4.webp'
import contractImg5 from '@/assets/images/home-banners/contract-5.webp'

const TWEEN_FACTOR_BASE = 0.2
const SLIDES = [contractImg1, contractImg2, contractImg3, contractImg4, contractImg5]

const numberWithinRange = (number, min, max) => Math.min(Math.max(number, min), max)

export function SampleContract({ className }) {
  const [carouselApi, setCarouselApi] = useState(null)
  const tweenFactor = useRef(0)
  const tweenNodes = useRef([])

  const setTweenNodes = useCallback((currentApi) => {
    if (!currentApi) return
    tweenNodes.current = currentApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('#contract-sample')
    })
  }, [])

  const setTweenFactor = useCallback((currentApi) => {
    if (!currentApi) return
    tweenFactor.current = TWEEN_FACTOR_BASE * currentApi.scrollSnapList().length
  }, [])

  const tweenScale = useCallback((currentApi, eventName) => {
    if (!currentApi) return
    const engine = currentApi.internalEngine()
    const scrollProgress = currentApi.scrollProgress()
    const slidesInView = currentApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    currentApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const scale = numberWithinRange(tweenValue, 0, 1).toString()
        const tweenNode = tweenNodes.current[slideIndex]

        if (tweenNode) tweenNode.style.transform = `scale(${scale})`
      })
    })
  }, [])

  useEffect(() => {
    if (!carouselApi) return undefined

    setTweenNodes(carouselApi)
    setTweenFactor(carouselApi)
    tweenScale(carouselApi)

    carouselApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale)

    return function cleanup() {
      carouselApi
        ?.off('reInit', setTweenNodes)
        .off('reInit', setTweenFactor)
        .off('reInit', tweenScale)
        .off('scroll', tweenScale)
        .off('slideFocus', tweenScale)
    }
  }, [carouselApi, setTweenNodes, setTweenFactor, tweenScale])

  return (
    <section className={cn('container', className)} id="contractsSample">
      <h2 className="mb-10 text-center font-bold text-gray-800">نمونه قرارداد آنلاین در املاین</h2>

      <Carousel
        opts={{
          loop: true,
          direction: 'rtl',
          align: 'center',
          containScroll: 'trimSnaps',
        }}
        setApi={setCarouselApi}
        className="relative w-full"
      >
        <CarouselContent className="ml-0 py-2">
          {SLIDES.map((img, id) => (
            <CarouselItem key={img.src} className="basis-1/2 pl-4">
              <div
                id="contract-sample"
                className="relative aspect-[40/56] overflow-hidden rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)]"
              >
                <Image
                  src={img}
                  alt={`نمونه قرارداد ${id + 1}`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" /> */}
      </Carousel>
    </section>
  )
}
