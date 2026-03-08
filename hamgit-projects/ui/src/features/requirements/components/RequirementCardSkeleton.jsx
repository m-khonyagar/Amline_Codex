import { Skeleton } from '@/components/ui/Skeleton'

function RequirementCardSkeleton() {
  return (
    <div>
      <div className="bg-background rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between">
            <div className="flex justify-start gap-2 items-center">
              <Skeleton className="w-[32px] h-[32px] rounded-full" />
              <Skeleton className="w-10 h-3" />
            </div>
            <div className="flex gap-1 items-center">
              <div className="text-sm text-gray-500 flex gap-1 items-center">
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="h-3 w-4" />
              <Skeleton className="h-3 w-4" />
            </div>
          </div>
          <Skeleton className="w-10 h-2" />
          <div className="flex">
            <div className="flex flex-col gap-1 w-[80%]">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="w-10 h-2" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="w-10 h-2" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="w-10 h-2" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="w-10 h-2" />
              </div>
            </div>
            <div className="flex flex-col gap-1  w-[50%]">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="w-10 h-2" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="w-10 h-2" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="w-10 h-2" />
              </div>
              <div className="flex gap-2 items-center">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="w-10 h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequirementCardSkeleton
