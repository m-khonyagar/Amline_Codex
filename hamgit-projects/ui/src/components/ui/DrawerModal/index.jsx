import { useEffect } from 'react'
import { Drawer } from 'vaul'
import { cn } from '@/utils/dom'
import { isClientSide } from '@/utils/environment'

function DrawerModal({
  show = false,
  dismissible = true,
  handleClose = () => {},
  modalHeader = null,
  pure = false,
  className,
  children,
}) {
  useEffect(() => {
    // TODO: get from webview util after fix circular import
    if (isClientSide() && window?.WebViewInterface) {
      const webview = window.WebViewInterface
      try {
        webview.toggleRefresh(!show)
      } catch (error) {
        console.error(error)
      }
    }
  }, [show])

  return (
    <Drawer.Root open={show} onClose={handleClose} dismissible={dismissible}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[499]" onClick={handleClose} />
        <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] max-h-[90%] mt-24 fixed bottom-0 left-0 right-0 z-[500]">
          <div
            className={cn('bg-white rounded-t-[10px] flex-1 flex flex-col overflow-hidden', {
              'py-5': !pure,
            })}
          >
            <div
              className={cn('px-6 mx-auto w-12 h-1.5 flex-shrink-0 rounded-full  mb-3', {
                'bg-zinc-300': pure,
                'bg-zinc-500 absolute top-4 left-1/2 -translate-x-1/2 z-[500]': pure,
              })}
            />

            {modalHeader && (
              <div className="px-6 max-w-md mx-auto">
                <Drawer.Title className="font-medium mb-4 text-gray-300 flex justify-center">
                  {modalHeader}
                </Drawer.Title>
              </div>
            )}

            <div className={cn({ 'px-6 overflow-auto': !pure }, className)}>{children}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default DrawerModal
