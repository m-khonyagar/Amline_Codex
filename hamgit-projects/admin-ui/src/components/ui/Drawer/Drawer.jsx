import { Drawer as DrawerBase } from 'vaul'

const Drawer = ({
  open = false,
  dismissible = true,
  // className,
  children,
  onOpenChange = () => {},
}) => {
  return (
    <DrawerBase.Root
      open={open}
      direction="right"
      dismissible={dismissible}
      onOpenChange={onOpenChange}
    >
      <DrawerBase.Portal>
        <DrawerBase.Overlay className="fixed inset-0 bg-black/40 z-[499]" onClick={onOpenChange} />
        <DrawerBase.Content
          className="right-0 top-0 bottom-0 fixed z-[500] outline-none w-[310px] flex flex-col"
          // The gap between the edge of the screen and the drawer is 8px in this case.
          style={{ '--initial-transform': 'calc(100% + 8px)' }}
        >
          <div className="bg-zinc-50 h-full w-full flex-grow flex flex-col rounded-l-lg">
            <DrawerBase.Title className="font-medium mb-2 text-zinc-900 sr-only">
              sidebar
            </DrawerBase.Title>

            <DrawerBase.Description className="sr-only">Description</DrawerBase.Description>

            {children}
          </div>
        </DrawerBase.Content>
      </DrawerBase.Portal>
    </DrawerBase.Root>
  )
}

export default Drawer
