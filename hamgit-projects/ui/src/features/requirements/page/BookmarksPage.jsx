import { useMemo, useState } from 'react'
import { HeaderNavigation } from '@/features/app'
import useGetBookmarks from '../api/get-bookmark'
import { AdTypeEnums } from '@/data/enums/ad_type_enums'
import WantedCard from '../components/WantedCard'
import SwapCard from '../components/SwapCard'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import SegmentedControl from '@/components/ui/SegmentedControl'
import AdCard from '../../ads/components/AdCard'

const options = [
  {
    label: 'آگهی ها',
    value: 1,
    types: [AdTypeEnums.AD],
  },
  {
    label: 'نیازمندی ها',
    value: 2,
    types: [AdTypeEnums.WANTED_AD, AdTypeEnums.SWAP_AD],
  },
]

export default function BookmarksPage() {
  const bookmarksQuery = useGetBookmarks()
  const bookmarks = useMemo(() => bookmarksQuery?.data?.data || [], [bookmarksQuery?.data])
  const [activeTab, setActiveTab] = useState(options[0])

  const ads = useMemo(() => bookmarks.filter((i) => i.ad_type === AdTypeEnums.AD), [bookmarks])
  const requirements = useMemo(
    () => bookmarks.filter((i) => [AdTypeEnums.WANTED_AD, AdTypeEnums.SWAP_AD].includes(i.ad_type)),
    [bookmarks]
  )

  return (
    <>
      <HeaderNavigation title="نشان شده ها" />

      <div className="flex-grow p-6 flex flex-col gap-6">
        <SegmentedControl
          value={activeTab}
          segments={options}
          onChange={(option) => setActiveTab(option)}
        />

        <LoadingAndRetry query={bookmarksQuery}>
          {activeTab.types.includes(AdTypeEnums.AD)
            ? ads.map((ad) => <AdCard key={ad.id} ad={{ ...ad.ad_data, is_saved: true }} />)
            : requirements.map((ad) => {
                const Comp = ad.ad_type === AdTypeEnums.WANTED_AD ? WantedCard : SwapCard
                return <Comp key={ad.id} requirement={{ ...ad.ad_data, is_saved: true }} />
              })}
        </LoadingAndRetry>

        {!bookmarksQuery.isError && !bookmarksQuery.isPending && !bookmarks.length && (
          <span className="text-rust-600 text-lg text-center mt-40">نشان شده ای وجود ندارد</span>
        )}
      </div>
    </>
  )
}
