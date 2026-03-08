import { useMemo } from 'react'
import { useRouter } from 'next/router'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import RequirementCardSkeleton from './RequirementCardSkeleton'
import { useGetRequirements } from '@/features/requirements'
import InfiniteButton from '@/components/InfiniteButton'
import WantedCard from './WantedCard'
import RequirementsFilter from './RequirementsFilter'
import { useAppContext } from '@/features/app'

const LIMIT = 10

function WantedList() {
  const { defaultCities } = useAppContext()
  const router = useRouter()
  const { query } = router
  const { type } = query

  const requirementsQuery = useGetRequirements(
    { limit: LIMIT, filters: query, cityIds: defaultCities?.cities },
    { enabled: router.isReady, staleTime: Infinity }
  )

  const requirements = useMemo(
    () => (requirementsQuery.data?.pages || []).flatMap((page) => page?.data || []),
    [requirementsQuery.data]
  )

  return (
    <div>
      <RequirementsFilter requirementType={type} />

      <div className="flex flex-col gap-7">
        <LoadingAndRetry query={requirementsQuery} loadingComponent={RequirementCardSkeleton}>
          {!requirementsQuery.isLoading && requirements.length === 0 && (
            <div className="flex justify-center items-center mt-40">
              <span className="text-rust-600 text-lg">نیازمندی ای وجود ندارد</span>
            </div>
          )}

          {requirements.map((requirement) => (
            <WantedCard key={requirement.id} requirement={requirement} />
          ))}

          <InfiniteButton
            onLoad={() => requirementsQuery.fetchNextPage()}
            disabled={!requirementsQuery.hasNextPage}
            loading={requirementsQuery.isFetchingNextPage}
          />
        </LoadingAndRetry>
      </div>
    </div>
  )
}

export default WantedList
