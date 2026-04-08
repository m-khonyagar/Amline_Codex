import { Skeleton } from '@/components/ui/Skeleton'

function ReceiptCardSkeleton() {
  return (
    <div className="bg-background rounded-2xl shadow-md">
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-40" />
        </div>

        <div className="flex justify-between">
          <Skeleton className="w-20 h-3 mt-6" />
          <Skeleton />
        </div>
      </div>
      <hr />
      <div className="flex justify-between items-center p-3 py-4">
        <div className="">
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="w-32 h-3" />
          </div>
        </div>
        <Skeleton className="w-40 h-3" />
      </div>
    </div>
  )
}

export default ReceiptCardSkeleton
