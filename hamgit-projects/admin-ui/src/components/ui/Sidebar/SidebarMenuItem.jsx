import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const SidebarMenuItem = forwardRef(({ className, children, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn('group/menu-item relative', className)}
    {...props}
  >
    {children}
  </li>
))

SidebarMenuItem.displayName = 'SidebarMenuItem'

export default SidebarMenuItem
