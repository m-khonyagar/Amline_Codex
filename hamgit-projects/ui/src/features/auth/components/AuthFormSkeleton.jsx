import { Skeleton } from '@/components/ui/Skeleton'

function AuthFormSkeleton() {
  return (
    <div className="mx-6 mt-24 pt-4">
      <Skeleton className="mx-auto w-[63px] h-[84px]" />

      <Skeleton className="mt-9 mx-auto w-[100px] h-[24px]" />

      <Skeleton className="mt-5 mx-auto w-full h-[52px]" />

      <Skeleton className="mt-6 w-1/2 h-[24px]" />

      <Skeleton className="mt-8 mx-auto w-full h-[50px]" />
    </div>
  )
}

export default AuthFormSkeleton
