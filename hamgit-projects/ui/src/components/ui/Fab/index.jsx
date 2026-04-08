import * as Dialog from '@radix-ui/react-dialog'
import { useRef, useState } from 'react'
import { CloseIcon } from '@/components/icons'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { cn } from '@/utils/dom'
import FabItem from './FabItem'

import classes from './Fab.module.scss'
import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect'

function Fab({ children, open, onOpenChange }) {
  const fabRef = useRef()
  const [offsetLeft, setOffsetLeft] = useState(24)

  const [localOpen, setOpen] = useUncontrolled({
    value: open,
    onChange: onOpenChange,
    defaultValue: false,
  })

  useIsomorphicEffect(() => {
    if (!fabRef.current) return

    const mainEl = document.querySelector('#__main')
    setOffsetLeft(window.innerWidth - mainEl.offsetWidth - mainEl.offsetLeft + 24)
  }, [])

  return (
    <Dialog.Root open={localOpen} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          ref={fabRef}
          type="button"
          aria-label="add"
          style={{ left: `${offsetLeft}px` }}
          className={cn(classes.fab__trigger, { [classes['fab__trigger--open']]: localOpen })}
        >
          <CloseIcon size={28} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={classes.fab__overlay} />
        <Dialog.Content style={{ left: `${offsetLeft}px` }} className={classes.fab__content}>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

Fab.Item = FabItem

export default Fab
