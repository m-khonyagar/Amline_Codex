import { CloseIcon } from '@/components/icons'
import { cn } from '@/utils/dom'
import * as DialogPrimitive from '@radix-ui/react-dialog'

const Dialog = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
  closeOnBackdrop = true,
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 pointer-events-auto" />
        <DialogPrimitive.Content
          // onOpenAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => !closeOnBackdrop && e.preventDefault()}
          onInteractOutside={(e) => !closeOnBackdrop && e.preventDefault()}
          className={cn(
            'fixed left-[50%] top-[50%] max-h-[calc(100vh-64px)] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border outline-none bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
            className
          )}
        >
          <div className="flex flex-col space-y-1.5 text-right">
            <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          </div>

          <DialogPrimitive.Close
            // tabIndex={-1}
            className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <CloseIcon size={16} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default Dialog
