import { cn } from '@/utils/dom'
import { forwardRef } from 'react'
import { useSidebar } from '.'
import { ToggleSidebarIcon } from '@/components/icons'

const SidebarTrigger = forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="trigger"
      // size="icon"
      className={cn('h-6 w-6 text-gray-600', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <ToggleSidebarIcon size={18} />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
})

SidebarTrigger.displayName = 'SidebarTrigger'

export default SidebarTrigger
