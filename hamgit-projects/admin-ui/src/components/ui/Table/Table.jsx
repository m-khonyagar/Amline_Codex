import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
))

Table.displayName = 'Table'

export default Table
