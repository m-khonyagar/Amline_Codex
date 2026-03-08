import React from 'react'
import { cn } from '@/utils/dom'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { CircleCheckBoldIcon, CircleIcon } from '@/components/icons'
import classes from './HowWriteContract.module.scss'

function HowWriteContract() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    freezeOnceVisible: true,
  })

  return (
    <div>
      <h3 className="text-lg font-medium text-center">چجوری تو املاین قرارداد بنویسم؟!</h3>
      <div
        className={cn('mt-12 space-y-7 relative', {
          [classes.is_visible]: isIntersecting,
        })}
        ref={ref}
      >
        <div className="w-[2px] right-2.5 top-2 bottom-2 absolute bg-gray-200">
          <div className={classes.progressbar} />
        </div>

        <div className="flex items-center gap-3.5">
          <div className={cn(classes.steps, classes.step1)}>
            <CircleIcon color="#D7D9DE" className={cn(classes.icon, classes.empty)} />
            <CircleCheckBoldIcon color="#53BB6A" className={cn(classes.icon, classes.checked)} />
          </div>

          <p className="text-gray-900">تکمیل اطلاعات مالک و مستاجر</p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className={cn(classes.steps, classes.step2)}>
            <CircleIcon color="#D7D9DE" className={cn(classes.icon, classes.empty)} />
            <CircleCheckBoldIcon color="#53BB6A" className={cn(classes.icon, classes.checked)} />
          </div>

          <p className="text-gray-900">اسکن سند و تکمیل اطلاعات ملک</p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className={cn(classes.steps, classes.step3)}>
            <CircleIcon color="#D7D9DE" className={cn(classes.icon, classes.empty)} />
            <CircleCheckBoldIcon color="#53BB6A" className={cn(classes.icon, classes.checked)} />
          </div>

          <p className="text-gray-900">تاریخ و مبلغ قرارداد</p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className={cn(classes.steps, classes.step4)}>
            <CircleIcon color="#D7D9DE" className={cn(classes.icon, classes.empty)} />
            <CircleCheckBoldIcon color="#53BB6A" className={cn(classes.icon, classes.checked)} />
          </div>

          <p className="text-gray-900">امضای قرارداد توسط مالک و مستاجر</p>
        </div>

        <div className="flex items-center gap-3.5">
          <div className={cn(classes.steps, classes.step5)}>
            <CircleIcon color="#D7D9DE" className={cn(classes.icon, classes.empty)} />
            <CircleCheckBoldIcon color="#53BB6A" className={cn(classes.icon, classes.checked)} />
          </div>

          <p className="text-gray-900">صدور کدرهگیری و ارسال قرارداد </p>
        </div>
      </div>
    </div>
  )
}

export default HowWriteContract
