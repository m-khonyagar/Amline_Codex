import { cn } from '@/utils/dom'
import { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'

const SidebarMenuSub = forwardRef(({ className, children, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-r border-sidebar-border px-2.5',
      'group-data-[collapsible=icon]:hidden',
      className
    )}
    {...props}
  >
    {children}
  </ul>
))

SidebarMenuSub.displayName = 'SidebarMenuSub'

const SidebarMenuSubItem = forwardRef(({ ...props }, ref) => <li ref={ref} {...props} />)

SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

const SidebarMenuSubButton = forwardRef(
  ({ href, size = 'md', isActive, className, ...props }, ref) => {
    const Comp = href ? NavLink : 'a'

    return (
      <Comp
        end
        ref={ref}
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        to={href}
        className={({ isActive }) =>
          cn(
            'flex h-9 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
            'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground font-light',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            'group-data-[collapsible=icon]:hidden',
            isActive && href !== '#' ? 'text-primary' : 'hover:text-sidebar-accent-foreground',
            className
          )
        }
        {...props}
      />
    )
  }
)
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

export { SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton }
