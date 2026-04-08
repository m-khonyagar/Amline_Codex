import { cn } from '@/utils/dom'

function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-lg bg-gray-200', className)} {...props} />
}

export { Skeleton }
