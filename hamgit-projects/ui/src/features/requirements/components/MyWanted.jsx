import { useMemo } from 'react'
import useGetMyRequirements from '../api/get-my-requirements'
import RequirementCardSkeleton from './RequirementCardSkeleton'
import WantedCard from './WantedCard'
import InfiniteButton from '@/components/InfiniteButton'
import LoadingAndRetry from '@/components/LoadingAndRetry'

const LIMIT = 10

function MyWanted() {
  const myRequirementsQuery = useGetMyRequirements({ limit: LIMIT })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = myRequirementsQuery
  const myRequirements = useMemo(
    () => (data?.pages || []).flatMap((page) => page?.data || []),
    [data]
  )

  return (
    <LoadingAndRetry query={myRequirementsQuery} loadingComponent={RequirementCardSkeleton}>
      {!myRequirementsQuery.isLoading && myRequirements.length === 0 && (
        <div className="flex justify-center items-center mt-40">
          <span className="text-rust-600 text-lg">نیازمندی ای وجود ندارد</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {myRequirements.map((requirement) => (
          <WantedCard key={requirement.id} requirement={requirement} showStatus />
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

export default MyWanted
