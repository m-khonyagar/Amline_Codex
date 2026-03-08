import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import Link from 'next/link'
import { cn } from '@/utils/dom'
import { CircleLoadingIcon } from '@/components/icons'

const buttonVariantsSchema = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-primary text-primary bg-background hover:bg-primary/10',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
    gray: 'text-gray-900 bg-gray-200 hover:bg-gray-300',
  },
  size: {
    default: 'h-14 px-4 py-2',
    sm: 'h-12 px-3',
    lg: 'h-14 rounded-md px-8',
    icon: 'h-14 w-10',
  },
}

const buttonVariants = cva(
  'relative select-none inline-flex items-center justify-center whitespace-nowrap rounded-xl ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-25',
  {
    variants: buttonVariantsSchema,
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = forwardRef(
  (
    {
      className,
      variant,
      size,
      href,
      children,
      type = 'button',
      disabled = false,
      loading = false,
      ...props
    },
    ref
  ) => {
    const Comp = !!href && !disabled ? Link : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        ref={ref}
        type={type}
        href={href}
        {...props}
      >
        {children}
        {loading && (
          <div
            className={cn(
              'absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-50 bg-gray-900/30',
              size === 'sm' ? 'rounded-md' : 'rounded-xl'
            )}
          >
            <CircleLoadingIcon className="animate-spin" />
          </div>
        )}
      </Comp>
    )
  }
)

Button.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.string,
}

export default Button
export { buttonVariants, buttonVariantsSchema }
