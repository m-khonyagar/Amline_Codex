import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import logoImg from '@/assets/images/landing/logo-icon.svg'

const STATS = {
  contractValue: 20, // میلیارد تومان
  activeUsers: 2000,
  contractCount: 10,
  activityHistory: 3,
}
const duration = 2000

function Stats({ className }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true,
  })
  const [animatedStats, setAnimatedStats] = useState({
    contractValue: 0,
    activeUsers: 0,
    contractCount: 0,
    activityHistory: 0,
  })

  useEffect(() => {
    if (!isIntersecting) return

    const easeOutQuad = (t) => t * (2 - t)
    const startTimestamp = performance.now()

    const step = () => {
      const elapsed = performance.now() - startTimestamp
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuad(progress)

      setAnimatedStats(
        Object.fromEntries(
          Object.entries(STATS).map(([key, value]) => [key, Math.round(easedProgress * value)])
        )
      )

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isIntersecting])

  return (
    <div className={className}>
      <div className="flex items-center gap-3.5">
        <Image src={logoImg.src} width={60} height={60} alt="Logo" />
        <div>
          <h4 className="font-medium leading-5">
            املاین؛ بیمه اجاره املاک
            <br />
            با املاین هیچ اجاره‌ای عقب نمی‌افتد
          </h4>

          <p className="text-xs">برخی از دستاورد های املاین:</p>
        </div>
      </div>

      <div
        className="bg-[#F5F5F5] grid grid-cols-2 gap-x-10 gap-y-16 rounded-xl p-7 mt-3.5"
        style={{ boxShadow: '3px 4px 0px 0px #00000066' }}
        ref={ref}
      >
        <div className="w-36">
          <div className="flex items-end text-[#AD3A10]">
            <span className="text-5xl fa">{animatedStats.contractValue}</span>
            <p>میلیارد تومان</p>
          </div>
          <p className="text-sm text-[#898989]">ارزش قرارداد ها</p>
        </div>

        <div className="w-36 mr-auto">
          <div className="flex items-end text-[#AD3A10]">
            <span className="text-5xl fa">{animatedStats.activeUsers}</span>
            <p>نفر</p>
          </div>
          <p className="text-sm text-[#898989]">کاربر فعال املاین</p>
        </div>

        <div className="w-36">
          <div className="flex items-end text-[#AD3A10]">
            <span className="text-5xl fa">{animatedStats.contractCount}</span>
            <p>عدد</p>
          </div>
          <p className="text-sm text-[#898989]">قرارداد آنلاین</p>
        </div>

        <div className="w-36 mr-auto">
          <div className="flex items-end text-[#AD3A10]">
            <span className="text-5xl fa">{animatedStats.activityHistory}</span>
            <p>سال</p>
          </div>
          <p className="text-sm text-[#898989]">سابقه فعالیت</p>
        </div>
      </div>
    </div>
  )
}

export default Stats
