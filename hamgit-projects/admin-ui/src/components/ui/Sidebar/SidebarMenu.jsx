import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const SidebarMenu = forwardRef(({ className, children, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn('flex w-full min-w-0 flex-col gap-1', className)}
    {...props}
  >
    {children}
  </ul>
))

SidebarMenu.displayName = 'SidebarMenu'

export default SidebarMenu
