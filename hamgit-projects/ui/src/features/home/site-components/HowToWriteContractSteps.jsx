import React from 'react'
import { cn } from '@/utils/dom'

export function HowToWriteContractSteps({ title, steps, className }) {
  return (
    <section className={cn('container', className)}>
      <h2 className="mb-6 text-center text-lg font-bold text-stone-900">{title}</h2>

      <div className="grid grid-cols-1 gap-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-start gap-3 rounded-xl bg-zinc-100 px-4 py-4 shadow-sm"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {step.number}
            </span>

            <div>
              <h4 className="mb-1 text-sm font-semibold text-gray-900">{step.title}</h4>

              <p className="text-xs leading-5 text-zinc-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
