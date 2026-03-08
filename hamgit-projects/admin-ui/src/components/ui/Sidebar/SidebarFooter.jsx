import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const SidebarFooter = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
})

SidebarFooter.displayName = 'SidebarFooter'

export default SidebarFooter
