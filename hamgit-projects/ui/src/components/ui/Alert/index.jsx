import { cva } from 'class-variance-authority'
import { cn } from '@/utils/dom'

const alertVariantsSchema = {
  variant: {
    default: 'bg-gray-50 text-gray-800',
    success: 'bg-teal-100 text-teal-600',
    danger: ' bg-rust-100 text-rust-600',
    info: 'bg-gray-100 text-gray-900',
  },
}

const alertVariants = cva('my-auto px-6 py-4 rounded-xl', {
  variants: alertVariantsSchema,
  defaultVariants: {
    variant: 'default',
  },
})

function Alert({ children, className, variant }) {
  return <div className={cn(alertVariants({ variant, className }))}>{children}</div>
}

export default Alert
export { alertVariants, alertVariantsSchema }
