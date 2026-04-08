import { useMemo } from 'react'
import { useRouter } from 'next/router'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import RequirementCardSkeleton from './RequirementCardSkeleton'
import InfiniteButton from '@/components/InfiniteButton'
import useGetAllSwaps from '../api/get-all-swap'
import SwapCard from './SwapCard'

const LIMIT = 10

function SwapsList() {
  const router = useRouter()
  const swapsQuery = useGetAllSwaps({ limit: LIMIT }, { enabled: router.isReady })

  const requirements = useMemo(
    () => (swapsQuery.data?.pages || []).flatMap((page) => page?.data || []),
    [swapsQuery.data]
  )

  return (
    <div>
      <div className="flex flex-col gap-7">
        <LoadingAndRetry query={swapsQuery} loadingComponent={RequirementCardSkeleton}>
          {!swapsQuery.isLoading && requirements.length === 0 && (
            <div className="flex justify-center items-center mt-40">
              <span className="text-rust-600 text-lg">نیازمندی ای وجود ندارد</span>
            </div>
          )}

          {requirements.map((requirement) => (
            <SwapCard key={requirement.id} requirement={requirement} />
          ))}

          <InfiniteButton
            onLoad={() => swapsQuery.fetchNextPage()}
            disabled={!swapsQuery.hasNextPage}
            loading={swapsQuery.isFetchingNextPage}
          />
        </LoadingAndRetry>
      </div>
    </div>
  )
}

export default SwapsList
