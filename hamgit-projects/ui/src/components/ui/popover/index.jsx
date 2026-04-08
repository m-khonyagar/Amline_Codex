import React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/utils/dom'

const Popover = PopoverPrimitive.Root

Popover.Trigger = PopoverPrimitive.Trigger

Popover.Content = React.forwardRef(
  ({ children, className, sideOffset = 4, align = 'center', ...props }, forwardedRef) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        ref={forwardedRef}
        align={align}
        className={cn(
          'z-[100] rounded-md bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      >
        {children}
        <PopoverPrimitive.Arrow fill="white" />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
)

export default Popover
