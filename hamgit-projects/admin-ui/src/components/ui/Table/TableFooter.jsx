import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const TableFooter = forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
))

TableFooter.displayName = 'TableFooter'

export default TableFooter
