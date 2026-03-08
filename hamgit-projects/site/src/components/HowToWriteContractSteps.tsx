import { cn } from '@/lib/utils'

export interface Step {
  number: string
  title: string
  description: React.ReactNode
}

interface HowToWriteContractStepsProps {
  title: string
  steps: Step[]
  className?: string
}

export const HowToWriteContractSteps = ({
  title,
  steps,
  className,
}: HowToWriteContractStepsProps) => {
  return (
    <section className={cn('container', className)}>
      <h2 className="mb-6 text-center font-bold text-stone-900 sm:mb-8 sm:text-lg md:mb-12 md:text-xl lg:text-2xl">
        {title}
      </h2>

      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {steps.map(step => (
          <div
            key={step.number}
            className="flex items-center gap-4 rounded-lg bg-zinc-100 px-2 py-4 shadow-sm sm:px-4 md:px-6"
          >
            <span className="fa text-primary/40 flex size-9 shrink-0 translate-y-1 items-center justify-center text-4xl font-bold lg:size-12 lg:text-5xl">
              {step.number}
            </span>
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-medium text-gray-900 sm:text-base lg:text-lg">
                {step.title}
              </h4>
              <p className="text-xs text-zinc-600 sm:text-sm lg:text-base">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
