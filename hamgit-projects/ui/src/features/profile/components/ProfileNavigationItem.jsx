import Link from 'next/link'
import { createElement } from 'react'
import { ChevronLeftIcon } from '@/components/icons'
import { cn } from '@/utils/dom'

function ProfileNavigationItem({ label, icon, href, disabled, onClick }) {
  const Comp = href ? Link : 'button'

  return (
    <Comp
      href={href}
      disabled={disabled}
      onClick={onClick}
      className={cn('flex items-center py-3 gap-2 group', {
        'cursor-pointer hover:text-teal-900': !disabled,
        'text-gray-300': disabled,
      })}
    >
      {icon && createElement(icon)}
      {label}
      <ChevronLeftIcon
        className={cn('mr-auto text-gray-300 transition-all', {
          'group-hover:text-teal-900': !disabled,
        })}
        size={24}
      />
    </Comp>
  )
}

export default ProfileNavigationItem
