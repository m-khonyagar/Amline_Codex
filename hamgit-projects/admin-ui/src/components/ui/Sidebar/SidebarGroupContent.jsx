import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const SidebarGroupContent = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn('w-full text-sm', className)}
    {...props}
  >
    {children}
  </div>
))

SidebarGroupContent.displayName = 'SidebarGroupContent'

export default SidebarGroupContent
