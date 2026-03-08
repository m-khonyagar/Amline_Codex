import { type ComponentProps } from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { LoaderCircleIcon } from '@/assets/icons'

const buttonVariants = cva(
  "inline-flex items-center overflow-hidden justify-center gap-2 whitespace-nowrap rounded-lg text-sm shadow-black/25 transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:shadow-md active:shadow-none active:bg-primary-active focus-visible:ring-primary/20',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-gray-200',
        destructive:
          'bg-destructive text-white hover:shadow-md active:shadow-none active:bg-destructive-active focus-visible:ring-destructive/20',
        outline:
          'border border-primary bg-background text-primary hover:shadow-md active:shadow-none active:border-primary-active active:text-primary-active focus-visible:ring-primary/20',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:bg-accent-active dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline active:text-primary-active',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn('relative', buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/60">
          <LoaderCircleIcon className="size-4 animate-spin" />
        </span>
      )}
      <Slottable>{children}</Slottable>
    </Comp>
  )
}

export { Button, buttonVariants }
