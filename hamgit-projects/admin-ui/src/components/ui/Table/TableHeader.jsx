import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
))

TableHeader.displayName = 'TableHeader'

export default TableHeader
