import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const SidebarHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
})

SidebarHeader.displayName = 'SidebarHeader'

export default SidebarHeader
