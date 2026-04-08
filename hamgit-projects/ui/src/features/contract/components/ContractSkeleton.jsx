import { Skeleton } from '@/components/ui/Skeleton'

function ContractSkeleton(key) {
  return (
    <div className="bg-background rounded-2xl shadow-md" key={key}>
      <div className="flex gap-4 p-6 pb-7">
        <Skeleton className="w-[60px] h-[50px]" />
        <div className="flex flex-col w-full gap-3">
          <Skeleton className="w-2/5 h-4" />
          <Skeleton className="w-3/5 h-4" />
        </div>
      </div>
      <hr />
      <div className="flex justify-between p-5">
        <Skeleton className="w-1/5 h-4" />
        <Skeleton className="w-1/5 h-4" />
      </div>
    </div>
  )
}

export default ContractSkeleton
