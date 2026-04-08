import { cn } from '@/lib/utils'
import { env } from '@/config/env'
import { Button } from '@/components/ui/button'

export function CallToActionEndBanner({ className = '' }: { className?: string }) {
  return (
    <section
      className={cn(
        className,
        'relative flex w-full flex-col items-center justify-center py-24 md:py-32',
      )}
    >
      <div className="absolute top-1/2 left-1/2 -z-10 size-48 -translate-x-1/2 -translate-y-3/5 rounded-full bg-[#DBF0EE] sm:size-52 md:size-60" />
      <div className="z-10 flex flex-col items-center justify-center text-center">
        <h2 className="mb-6 text-lg leading-normal font-bold text-stone-900 sm:mb-8 sm:text-2xl md:text-3xl lg:text-4xl">
          معامله ملکت رو عقب ننداز و با املاین، سریع
          <br />
          امن و آنلاین قراردادت رو ببند!
        </h2>
        <Button asChild>
          <a href={`${env.APP_URL}/contracts/new`}>از اینجا شروع کن</a>
        </Button>
      </div>
    </section>
  )
}
