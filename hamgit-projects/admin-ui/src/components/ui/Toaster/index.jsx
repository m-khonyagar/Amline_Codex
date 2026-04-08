import { Toaster as Sonner, toast } from 'sonner'
import styles from './toaster.module.scss'

import { cn } from '@/utils/dom'

function Toaster({ withBottomOffset }) {
  return (
    <Sonner
      // theme={theme}
      dir="rtl"
      richColors
      closeButton
      position="bottom-center"
      offset={withBottomOffset ? '80px' : '32px'}
      className={cn('toaster', styles.toaster, {
        [styles['toaster--with-bottom-offset']]: withBottomOffset,
      })}
      toastOptions={{
        classNames: {
          toast: styles.toast,
          title: 'font-normal',
          closeButton: styles['toaster__close-button'],
          icon: 'hidden',
        },
      }}
    />
  )
}

export default Toaster
export { toast }
