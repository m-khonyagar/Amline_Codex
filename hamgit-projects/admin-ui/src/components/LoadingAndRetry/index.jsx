import { cn } from '@/utils/dom'
import Retry from '../Retry'
import { CircleLoadingIcon } from '../icons'
import { Skeleton } from '../ui/Skeleton'

function SkeletonLoading({ className, skeletonItemCount, skeletonItemHeight }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {Array.from({ length: skeletonItemCount }).map((_, i) => (
        <Skeleton key={i} style={{ height: `${skeletonItemHeight}px` }} />
      ))}
    </div>
  )
}

function DefaultLoadingComponent({ className, size = 24 }) {
  return (
    <div className={cn('flex items-center justify-center py-11 text-primary', className)}>
      <CircleLoadingIcon size={size} className="animate-spin" />
    </div>
  )
}

function LoadingAndRetry({
  query,
  children,
  errorClassName,
  loadingComponent,
  loadingClassName,
  ignore404 = true,
  skeletonItemCount = 4,
  checkRefetching = false,
  skeletonItemHeight = 45,
}) {
  const queries = Array.isArray(query) ? query : [query]

  const isError = queries.some(
    (q) => q.isError && (ignore404 ? q.error?.response?.status !== 404 : true)
  )
  // const isLoading = queries.some((q) => q.fetchStatus !== 'idle' && q.isPending)
  const isLoading = queries.some(
    (q) => q.isPending || q.isLoading || (checkRefetching && q.isRefetching)
  )

  const LoadingComp = loadingComponent || DefaultLoadingComponent

  if (isLoading) {
    return (
      <LoadingComp
        className={loadingClassName}
        skeletonItemCount={skeletonItemCount}
        skeletonItemHeight={skeletonItemHeight}
      />
    )
  }

  if (isError) {
    return <Retry className={errorClassName} query={query} />
  }

  return children
}

export default LoadingAndRetry
export { SkeletonLoading }
