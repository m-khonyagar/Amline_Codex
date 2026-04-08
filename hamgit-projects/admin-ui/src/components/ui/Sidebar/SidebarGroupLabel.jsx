import { cn } from '@/utils/dom'
import { forwardRef } from 'react'

const SidebarGroupLabel = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        'duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-sm font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
    >
      {children}
    </div>
  )
})

SidebarGroupLabel.displayName = 'SidebarGroupLabel'

export default SidebarGroupLabel
