/* eslint-disable no-param-reassign */
import React, { useEffect, useCallback, useRef, useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import classes from './Wheel.module.scss'
import { cn } from '@/utils/dom'

const CIRCLE_DEGREES = 360
const WHEEL_ITEM_SIZE = 50
const WHEEL_ITEM_COUNT = 18
const WHEEL_ITEMS_IN_VIEW = 2

export const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT
export const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW
export const WHEEL_RADIUS = Math.round(WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT))

const isInView = (wheelLocation, slidePosition) =>
  Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES

const setSlideStyles = (emblaApi, index, loop, slideCount, totalRadius) => {
  const slideNode = emblaApi.slideNodes()[index]
  const wheelLocation = emblaApi.scrollProgress() * totalRadius
  const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
  const positionLoopStart = positionDefault + totalRadius
  const positionLoopEnd = positionDefault - totalRadius

  let inView = false
  let angle = index * -WHEEL_ITEM_RADIUS

  if (isInView(wheelLocation, positionDefault)) {
    inView = true
  }

  if (loop && isInView(wheelLocation, positionLoopEnd)) {
    inView = true
    angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS
  }

  if (loop && isInView(wheelLocation, positionLoopStart)) {
    inView = true
    angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS
  }

  if (inView) {
    slideNode.style.opacity = '1'
    slideNode.style.transform = `translateY(-${
      index * 100
    }%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`
  } else {
    slideNode.style.opacity = '0'
    slideNode.style.transform = 'none'
  }
}

export const setContainerStyles = (emblaApi, wheelRotation) => {
  emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`
}

function Wheel({
  label,
  formatFn,
  slideCount,
  perspective,
  onSelect,
  onScroll,
  startIndex = 0,
  loop = false,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    startIndex,
    axis: 'y',
    dragFree: true,
    containScroll: false,
    watchSlides: true,
  })
  const rootNodeRef = useRef(null)
  const totalRadius = slideCount * WHEEL_ITEM_RADIUS
  const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS
  const slides = useMemo(
    () => Array.from({ length: slideCount }).map((_, i) => (formatFn ? formatFn(i) : i)),
    [formatFn, slideCount]
  )

  const inactivateEmblaTransform = useCallback((_emblaApi) => {
    if (!_emblaApi) return
    const { translate, slideLooper } = _emblaApi.internalEngine()
    translate.clear()
    translate.toggleActive(false)
    slideLooper.loopPoints.forEach(({ translate: _translate }) => {
      _translate.clear()
      _translate.toggleActive(false)
    })
  }, [])

  const rotateWheel = useCallback(
    (_emblaApi) => {
      const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset
      const wheelRotation = rotation * _emblaApi.scrollProgress()
      setContainerStyles(_emblaApi, wheelRotation)
      _emblaApi.slideNodes().forEach((_, index) => {
        setSlideStyles(_emblaApi, index, loop, slideCount, totalRadius)
      })
    },
    [slideCount, rotationOffset, loop, totalRadius]
  )

  useEffect(() => {
    if (!emblaApi) return () => {}

    const _emblaApi = emblaApi

    const onPointerUp = (__emblaApi) => {
      const { scrollTo, target, location } = __emblaApi.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)
    }

    const onReInit = (__emblaApi) => {
      inactivateEmblaTransform(__emblaApi)
      rotateWheel(__emblaApi)
    }

    _emblaApi.on('pointerUp', onPointerUp)
    _emblaApi.on('scroll', rotateWheel)
    _emblaApi.on('reInit', onReInit)

    inactivateEmblaTransform(_emblaApi)
    rotateWheel(_emblaApi)

    return () => {
      _emblaApi.off('pointerUp', onPointerUp)
      _emblaApi.off('scroll', rotateWheel)
      _emblaApi.off('reInit', onReInit)
    }
  }, [emblaApi, inactivateEmblaTransform, rotateWheel])

  useEffect(() => {
    if (!emblaApi) return () => {}

    const _emblaApi = emblaApi

    const onSelectCb = (__emblaApi) =>
      onSelect?.({ index: __emblaApi.internalEngine().index.get() })

    const onScrollCb = (__emblaApi) =>
      onScroll?.({ index: Math.round(__emblaApi.scrollProgress() * slideCount) })

    _emblaApi.on('select', onSelectCb)

    _emblaApi.on('scroll', onScrollCb)

    return () => {
      _emblaApi.off('select', onSelectCb)
      _emblaApi.off('scroll', onScrollCb)
    }
  }, [emblaApi, onScroll, onSelect, slideCount])

  return (
    <div className={classes.wheel}>
      {label && <div className={classes.wheel__label} />}

      <div className={classes.wheel__scene} ref={rootNodeRef}>
        <div
          className={cn(
            classes.wheel__viewport,
            classes[`wheel__viewport--perspective-${perspective}`]
          )}
          ref={emblaRef}
        >
          <div className={classes.wheel__container}>
            {slides.map((slide) => (
              <div className={classes.wheel__slide} key={slide}>
                {slide}
              </div>
            ))}
          </div>
        </div>
      </div>

      {label && <div className={classes.wheel__label}>{label}</div>}
    </div>
  )
}

export default Wheel
