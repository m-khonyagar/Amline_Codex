import AdsList from '../../ads/components/AdsList'
import useGetAds from '../../ads/api/get-ads-list'
import { adTypePaths } from '../../ads/constants'
import { AdPropertyTypeEnums, AdPropertyTypeTranslation } from '@/data/enums/ad_property_type_enums'

const items = [
  {
    id: 1,
    title: AdPropertyTypeTranslation.FOR_SALE,
    type: AdPropertyTypeEnums.FOR_SALE,
    link: `/ads/${adTypePaths.FOR_SALE}`,
  },
  {
    id: 2,
    title: AdPropertyTypeTranslation.FOR_RENT,
    type: AdPropertyTypeEnums.FOR_RENT,
    link: `/ads/${adTypePaths.FOR_RENT}`,
  },
]

export default function AdsSections() {
  return (
    <>
      {items.map((item) => (
        <div key={item.id}>
          <AdsList useQuery={useGetAds} adType={item.type} label={item.title} link={item.link} />
        </div>
      ))}
    </>
  )
}
