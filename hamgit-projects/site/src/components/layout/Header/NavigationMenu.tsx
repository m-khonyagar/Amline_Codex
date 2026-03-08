'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'

import type { MenuItem } from '@/types/common'
interface NavigationMenuProps {
  items: MenuItem[]
}

export const NavigationMenuComponent = ({ items }: NavigationMenuProps) => (
  <NavigationMenu dir="rtl" viewport={false} className="ms-4 max-lg:hidden lg:ms-8">
    <NavigationMenuList className="flex gap-2">
      {items.map(item =>
        item.children ? (
          <NavigationMenuItem key={item.key}>
            <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex min-w-36 flex-col">
                {item.children.map(child => {
                  const isInternal = child.href.startsWith('/')

                  return (
                    <li key={child.key}>
                      <NavigationMenuLink asChild>
                        {isInternal ? (
                          <Link href={child.href} target={child.target}>
                            {child.title}
                          </Link>
                        ) : (
                          <a href={child.href} target={child.target}>
                            {child.title}
                          </a>
                        )}
                      </NavigationMenuLink>
                    </li>
                  )
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem key={item.key}>
            <NavigationMenuLink asChild>
              <Link href={item.href!}>{item.title}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ),
      )}
    </NavigationMenuList>
  </NavigationMenu>
)
