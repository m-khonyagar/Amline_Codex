import type { SVGProps } from 'react'

export interface SvgIconProps extends SVGProps<SVGSVGElement> {
  color?: string
  className?: string
}

export type MenuItem = {
  key: string
  title: string
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  children?: {
    key: string
    title: string
    href: string
    target?: '_blank' | '_self' | '_parent' | '_top'
  }[]
}
