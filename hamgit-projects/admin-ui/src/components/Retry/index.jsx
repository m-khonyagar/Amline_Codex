import { cn } from '@/utils/dom'
import Button from '../ui/Button'

function Retry({ className, query }) {
  const queries = Array.isArray(query) ? query : [query]

  const isError = queries.some((q) => q.isError)

  const refetch = () => {
    queries.forEach((q) => q.isError && q.refetch())
  }

  return (
    isError && (
      <div
        className={cn(
          'flex flex-col justify-center items-center text-center py-5 gap-4',
          className
        )}
      >
        <span className="text-sm text-gray-700">
          هنگام دریافت اطلاعات خطایی رخ داد، لطفا مجددا تلاش کنید.
        </span>
        <Button color="gray" variant="outline" onClick={refetch}>
          تلاش مجدد
        </Button>
      </div>
    )
  )
}

export default Retry
