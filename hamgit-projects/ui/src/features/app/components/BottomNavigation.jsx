import { createElement, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  HomeIcon,
  UserIcon,
  DocumentIcon,
  UserBoldIcon,
  HomeBoldIcon,
  DocumentBoldIcon,
  AgehiIcon,
  AgehiBoldIcon,
} from '@/components/icons'
import { cn } from '@/utils/dom'
import { toast } from '@/components/ui/Toaster'
import { useAuthContext } from '@/features/auth'
import useMyContracts from '../../contract/api/my-contracts'
import { contractStatusEnum } from '@/features/contract'

const items = [
  {
    id: 1,
    title: 'خانه',
    path: '/',
    enabled: true,
    icon: HomeIcon,
    activeIcon: HomeBoldIcon,
  },
  {
    id: 2,
    title: 'آگهی و نیازمندی',
    enabled: true,
    path: '/ads/for_sale',
    icon: AgehiIcon,
    activeIcon: AgehiBoldIcon,
    // onClick: () => (typeof Goftino !== 'undefined' ? Goftino.open() : null), // eslint-disable-line no-undef
  },
  {
    id: 3,
    title: 'قراردادها',
    path: '/contracts',
    enabled: true,
    icon: DocumentIcon,
    activeIcon: DocumentBoldIcon,
    isContract: true,
  },
  {
    id: 4,
    title: 'حساب من',
    path: '/profile',
    enabled: true,
    icon: UserIcon,
    activeIcon: UserBoldIcon,
  },
]

function BottomNavigation() {
  const { currentUser } = useAuthContext()
  const myContractsQuery = useMyContracts({ enabled: !!currentUser })
  const contracts = useMemo(() => myContractsQuery?.data || [], [myContractsQuery.data])
  const hasDraftStatus = useMemo(() => {
    return contracts.some((i) => i.status === contractStatusEnum.DRAFT)
  }, [contracts])

  return (
    <div className="flex items-center justify-between px-4 bg-white pt-1 pb-2 shadow-[0_-8px_15px_0_rgba(0,0,0,0.06)]">
      {items.map((item) => (
        <NavItem key={item.id} {...item} activePing={item.isContract && hasDraftStatus} />
      ))}
    </div>
  )
}

function NavItem({ title, path, icon, activeIcon, enabled, onClick, activePing }) {
  const router = useRouter()
  const Comp = onClick || !enabled ? 'div' : Link
  // Support dynamic route: if path is /ads/for_sale and router.pathname is /ads/[type], check router.asPath or startsWith
  let isActive = router.pathname === path
  if (path.startsWith('/ads/') && router.pathname.startsWith('/ads/')) {
    // If current path is any /ads/*, make this active if asPath or query matches
    isActive = router.asPath.startsWith(path)
  }

  const handleClick = () => {
    if (!enabled) toast.success('به زودی')
    if (onClick) onClick()
  }

  // ...existing code...

  return (
    <Comp
      type="button"
      href={enabled ? path : undefined}
      className="flex flex-col items-center w-full py-2 gap-1.5 relative cursor-pointer"
      onClick={handleClick}
    >
      {isActive
        ? createElement(activeIcon, { className: 'text-secondary' })
        : createElement(icon, { className: 'text-gray-900' })}

      <span
        className={cn(
          'text-sm',
          isActive ? 'text-secondary text-nowrap' : 'text-gray-700 text-nowrap'
        )}
      >
        {title}
      </span>
      {activePing && <NavItemPing />}
    </Comp>
  )
}

function NavItemPing() {
  return (
    <span className="absolute top-1.5 left-1/2 translate-x-[6px]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
      </span>
    </span>
  )
}

export default BottomNavigation
