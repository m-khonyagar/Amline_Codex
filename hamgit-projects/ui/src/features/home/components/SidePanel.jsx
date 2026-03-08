import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Drawer } from 'vaul'
import { useGuideContext } from '@/features/guide'
import { CloseIcon, MenuIcon } from '@/components/icons'
import { ProfileCard } from '@/features/profile'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'

function SidePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { setIsSupportModalOpen } = useGuideContext()

  return (
    <Drawer.Root direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger className="relative flex flex-shrink-0 items-center justify-center gap-2 overflow-hidden">
        <MenuIcon />
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[51] bg-black/40" />

        <Drawer.Content
          className="right-0 top-0 bottom-0 fixed z-[51] outline-none max-w-[400px] w-[90%] flex"
          style={{ '--initial-transform': 'calc(100% + 8px)' }}
        >
          <div className="bg-zinc-50 h-full w-full grow flex flex-col">
            <div className="flex justify-center px-6 py-3 border-b border-[#E1E1E1] relative">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
              >
                <CloseIcon />
              </button>

              <Link href="/">
                <Image alt="logo" src="/images/logotype.svg" width={83} height={32} />
              </Link>
            </div>

            <div className="p-7 flex flex-col gap-7 text-gray-600">
              <ProfileCard />

              <Link href="/guide/contract">راهنمای انعقاد قرارداد</Link>

              <a href={publicRuntimeConfig.BLOG_URL}>بلاگ</a>

              <Link href="/wallet">کیف پول</Link>

              <button
                type="button"
                className="text-right"
                onClick={() => {
                  setIsOpen(false)
                  setIsSupportModalOpen(true)
                }}
              >
                ارتباط با کارشناسان
              </button>

              <Link href="/terms">قوانین و شرایط</Link>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default SidePanel
