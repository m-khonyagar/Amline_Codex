import Button from '@/components/ui/Button'
import { cn } from '@/utils/dom'

function Retry({ className, query }) {
  const queries = Array.isArray(query) ? query : [query]

  const isError = queries.some((q) => q.isError)

  const refetch = () => {
    queries.forEach((q) => q.isError && q.refetch())
  }

  return (
    isError && (
      <div className={cn('flex flex-col justify-center items-center text-center pt-5', className)}>
        هنگام دریافت اطلاعات خطایی رخ داد، لطفا مجددا تلاش کنید.
        <Button variant="link" onClick={refetch}>
          تلاش مجدد
        </Button>
      </div>
    )
  )
}

export default Retry
