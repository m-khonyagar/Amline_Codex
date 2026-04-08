import { useMemo } from 'react'
import Link from 'next/link'
import { useGetRequirements } from '@/features/requirements'
import { useAppContext } from '@/features/app'
import AdWantedCarousel from '../../../requirements/components/AdWantedCarousel'

const LIMIT = 10
function RequirementsSection() {
  const { defaultCities } = useAppContext()

  const query = useGetRequirements(
    { limit: LIMIT, cityIds: defaultCities?.cities },
    { enabled: !!defaultCities?.province }
  )
  const requirements = useMemo(
    () => (query?.data?.pages || []).flatMap((page) => page?.data || []),
    [query?.data]
  )

  if (query.isSuccess && requirements.length === 0) {
    return ''
  }

  return (
    <div>
      <div className="flex mb-3 justify-between">
        <Link href="/requirements">
          <h3 className="bg-gray-200 text-lg px-3 py-1 rounded-l-lg">نیازمندی ها</h3>
        </Link>
        <Link href="/requirements">
          <h3 className="bg-gray-200 text-lg px-3 py-1 rounded-r-lg">بیشتر</h3>
        </Link>
      </div>

      <AdWantedCarousel query={query} ads={requirements} />
    </div>
  )
}

export default RequirementsSection
