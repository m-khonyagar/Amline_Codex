import { Skeleton } from '@/components/ui/Skeleton'

export default function AdCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-2 text-[12px] shadow-[0_8px_32px_0_#21212114]">
      <Skeleton className="h-[160px] rounded-md" />
      <div className="flex flex-col pb-3 pt-5 gap-1 px-3">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-[20px] w-[20px]" />
          <Skeleton className="h-[20px] w-[150px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-[20px] w-[20px]" />
          <Skeleton className="h-[20px] w-[150px]" />
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-[20px] w-[20px]" />
          <Skeleton className="h-[20px] w-[150px]" />
        </div>
      </div>
    </div>
  )
}
