import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const TableRow = forwardRef(({ className, hover = true, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors  data-[state=selected]:bg-gray-200 even:bg-gray-50',
      { 'hover:bg-teal-100/50': hover },
      className
    )}
    {...props}
  />
))

TableRow.displayName = 'TableRow'

export default TableRow
