import Link from 'next/link'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { MenuBurgerIcon } from '@/assets/icons'
import type { MenuItem } from '@/types/common'

export function MobileMenu({ items }: { items: MenuItem[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <MenuBurgerIcon className="size-7" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle hidden>منو</SheetTitle>
        </SheetHeader>

        <nav className="p-4">
          {items.map(item =>
            item.children ? (
              <Accordion type="single" collapsible key={item.key}>
                <AccordionItem value={item.key}>
                  <AccordionTrigger className="py-2 font-normal">{item.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pr-4">
                      {item.children.map(child => {
                        const isInternal = child.href?.startsWith('/')

                        return (
                          <li key={child.key}>
                            {isInternal ? (
                              <Link
                                href={child.href || ''}
                                target={child.target}
                                className="block text-sm hover:underline"
                              >
                                {child.title}
                              </Link>
                            ) : (
                              <a
                                href={child.href}
                                target={child.target}
                                className="block text-sm hover:underline"
                              >
                                {child.title}
                              </a>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link key={item.key} href={item.href!} className="block py-2 text-sm hover:underline">
                {item.title}
              </Link>
            ),
          )}

          <Link href="/realtor" className="block text-sm hover:underline">
            ورود به پنل مشاور املاک
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
