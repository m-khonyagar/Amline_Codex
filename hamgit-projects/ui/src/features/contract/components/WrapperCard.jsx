import { cn } from '@/utils/dom'

function WrapperCard({ children, error }) {
  return (
    <div
      className={cn('bg-background rounded-2xl p-4 shadow-xl', {
        'border border-red-600': error,
      })}
    >
      {children}
    </div>
  )
}

export default WrapperCard
