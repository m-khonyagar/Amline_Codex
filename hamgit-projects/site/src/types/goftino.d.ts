// src/types/goftino.d.ts
export {}

declare global {
  interface Window {
    Goftino?: {
      setWidget(options?: {
        iconUrl?: string
        cssUrl?: string
        soundUrl?: string
        marginRight?: number
        marginLeft?: number
        marginBottom?: number
        hasIcon?: boolean
        hasSound?: boolean
        counter?: string
        filterWords?: string
      }): void
    }
  }
}
