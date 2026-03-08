import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'className'> {
  className?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function Input({ className, type, leftIcon, rightIcon, ...props }: InputProps) {
  if (!leftIcon && !rightIcon) {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base text-black shadow-xs transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          // 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive fa',
          className,
        )}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        'border-input dark:bg-input/30 flex h-9 w-full items-center overflow-hidden rounded-md border bg-white shadow-xs transition-shadow',
        // 'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive fa',
        className,
      )}
    >
      {rightIcon && (
        <div className="flex items-center justify-center px-2 text-zinc-400">{rightIcon}</div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 border-0 bg-transparent py-1 text-base text-black outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          leftIcon ? 'pl-0' : 'pl-2',
          rightIcon ? 'pr-0' : 'pr-2',
        )}
        {...props}
      />
      {leftIcon && (
        <>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center justify-center px-2 text-zinc-400">{leftIcon}</div>
        </>
      )}
    </div>
  )
}

export { Input }
