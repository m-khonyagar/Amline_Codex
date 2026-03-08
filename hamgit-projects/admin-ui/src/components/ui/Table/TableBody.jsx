import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
))

TableBody.displayName = 'TableBody'

export default TableBody
