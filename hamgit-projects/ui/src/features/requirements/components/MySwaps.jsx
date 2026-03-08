import { useMemo } from 'react'
import useGetMySwaps from '../api/get-my-swaps'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import InfiniteButton from '@/components/InfiniteButton'
import RequirementCardSkeleton from './RequirementCardSkeleton'
import SwapCard from './SwapCard'

const LIMIT = 10

function MySwaps() {
  const mySwapsQuery = useGetMySwaps({ limit: LIMIT })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = mySwapsQuery
  const mySwaps = useMemo(() => (data?.pages || []).flatMap((page) => page?.data || []), [data])

  return (
    <LoadingAndRetry query={mySwapsQuery} loadingComponent={RequirementCardSkeleton}>
      {!mySwapsQuery.isLoading && mySwaps.length === 0 && (
        <div className="flex justify-center items-center mt-40">
          <span className="text-rust-600 text-lg">نیازمندی ای وجود ندارد</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {mySwaps.map((requirement) => (
          <SwapCard key={requirement.id} requirement={requirement} showStatus />
        ))}
      </div>

      <InfiniteButton
        onLoad={() => fetchNextPage()}
        disabled={!hasNextPage}
        loading={isFetchingNextPage}
      />
    </LoadingAndRetry>
  )
}

export default MySwaps
