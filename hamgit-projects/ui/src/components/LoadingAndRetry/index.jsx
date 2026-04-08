/* eslint-disable react/no-array-index-key */
import { cn } from '@/utils/dom'
import Retry from '../Retry'
import { Skeleton } from '../ui/Skeleton'
import { CircleLoadingIcon } from '../icons'

function DefaultLoadingComponent({ className, skeletonItemCount, skeletonItemHeight }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {Array.from({ length: skeletonItemCount }).map((_, i) => (
        <Skeleton key={i} style={{ height: `${skeletonItemHeight}px` }} />
      ))}
    </div>
  )
}

function CircleLoading({ className, size = 42 }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <CircleLoadingIcon size={size} className="animate-spin text-teal-600" />
    </div>
  )
}

function LoadingAndRetry({
  query,
  children,
  errorClassName,
  loadingComponent,
  loadingClassName,
  ignore404 = false,
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
export { CircleLoading }
