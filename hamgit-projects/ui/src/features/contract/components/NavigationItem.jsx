import Link from 'next/link'
import { ChevronLeftIcon } from '@/components/icons'
import { cn } from '@/utils/dom'

function NavigationItem({ href = '#', disabled, completed, label, onDisabledClick }) {
  const Comp = disabled || href === null ? 'div' : Link

  const handleClick = (e) => {
    if (disabled) {
      onDisabledClick?.(e)
    }
  }

  return (
    <Comp
      href={disabled ? undefined : href}
      onClick={handleClick}
      className={cn(
        'flex justify-between bg-white py-3 pr-6 pl-4 rounded-lg shadow-xl',
        { 'text-gray-300': disabled },
        { 'text-green-600': completed && !disabled }
      )}
    >
      {label}

      <ChevronLeftIcon className="text-gray-300" />
    </Comp>
  )
}

export default NavigationItem
