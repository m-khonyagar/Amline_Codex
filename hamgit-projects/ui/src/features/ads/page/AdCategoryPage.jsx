import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { HeaderNavigation, useAppContext } from '@/features/app'
import AdCategoryNavigation from '../components/AdCategoryNavigation'
import useGetAds from '../api/get-ads-list'
import apartmentImg from '@/assets/images/property/apartment.svg'
import villaImg from '@/assets/images/property/villa.svg'
import landImg from '@/assets/images/property/land.svg'
import underConstructionImg from '@/assets/images/property/under_construction.svg'
import administrativeImg from '@/assets/images/property/administrative.svg'
import industrialImg from '@/assets/images/property/industrial.svg'
import commercialImg from '@/assets/images/property/commercial.svg'
import otherImg from '@/assets/images/property/other.svg'
import { propertyAdCategoryEnums, propertyAdCategoryTranslation } from '../constants'
import { createAdCategoryLink } from '../libs/adLink'
import AdsList from '../components/AdsList'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { LocationBold2Icon, PlusIcon } from '@/components/icons'
import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect'

const categories = [
  {
    id: 1,
    enabled: true,
    image: apartmentImg.src,
    title: propertyAdCategoryTranslation.APARTMENT,
    cat: propertyAdCategoryEnums.APARTMENT,
  },
  {
    id: 2,
    enabled: true,
    image: villaImg.src,
    title: propertyAdCategoryTranslation.VILLA,
    cat: propertyAdCategoryEnums.VILLA,
  },
  {
    id: 3,
    enabled: true,
    image: landImg.src,
    title: propertyAdCategoryTranslation.LAND,
    cat: propertyAdCategoryEnums.LAND,
  },
  {
    id: 4,
    enabled: false,
    image: underConstructionImg.src,
    title: propertyAdCategoryTranslation.IN_CONTRUCTION,
    cat: propertyAdCategoryEnums.IN_CONTRUCTION,
  },
  {
    id: 5,
    enabled: true,
    image: administrativeImg.src,
    title: propertyAdCategoryTranslation.ADMINISTRATIVE,
    cat: propertyAdCategoryEnums.ADMINISTRATIVE,
  },
  {
    id: 6,
    enabled: true,
    image: commercialImg.src,
    title: propertyAdCategoryTranslation.COMMERCIAL,
    cat: propertyAdCategoryEnums.COMMERCIAL,
  },
  {
    id: 7,
    enabled: true,
    image: industrialImg.src,
    title: propertyAdCategoryTranslation.INSDUSTRIAL,
    cat: propertyAdCategoryEnums.INSDUSTRIAL,
  },
  {
    id: 8,
    enabled: true,
    image: otherImg.src,
    title: propertyAdCategoryTranslation.OTHERS,
    cat: propertyAdCategoryEnums.OTHERS,
  },
]

export default function AdCategoryPage() {
  const router = useRouter()
  const { defaultCities, setIsOpen } = useAppContext()
  const adType = useMemo(() => router.query.type?.toLocaleUpperCase(), [router.query?.type])

  const addRef = useRef()
  const [offsetLeft, setOffsetLeft] = useState(24)

  const selectedType = useMemo(() => {
    const type = router.query.type?.toLocaleUpperCase()
    return type === 'FOR_RENT' ? { value: 'FOR_RENT' } : { value: 'FOR_SALE' }
  }, [router.query?.type])

  useIsomorphicEffect(() => {
    if (!addRef.current) return

    const mainEl = document.querySelector('#__main')
    setOffsetLeft(window.innerWidth - mainEl.offsetWidth - mainEl.offsetLeft + 24)
  }, [])

  return (
    <>
      <HeaderNavigation
        title="آگهی و نیازمندی ها"
        description="جدیدترین آگهی‌های خرید، فروش و اجاره املاک در سراسر ایران | جستجوی پیشرفته املاک بر اساس محله، متراژ و قیمت | ثبت رایگان آگهی ملک بدون کمیسیون"
        keywords="آگهی املاک، نیازمندی مسکن، خرید آپارتمان، فروش خانه، اجاره ملک، رهن کامل، املاک بدون واسطه، آگهی رایگان، قیمت مسکن، املاین"
        href="/"
      >
        <button type="button" onClick={() => setIsOpen(true)} className="flex fa ml-4">
          {defaultCities?.cities.length === 1 && defaultCities.city_name}
          {defaultCities?.cities.length > 1 && `${defaultCities.cities.length} شهر`}
          <LocationBold2Icon />
        </button>
      </HeaderNavigation>

      <div className="p-7 flex flex-col gap-5 border-b border-gray-400 mb-4">
        <SegmentedControl
          defaultValue={{ value: 'ADS' }}
          segments={[
            { value: 'ADS', path: '/ads/for_sale', label: 'آگهی ها' },
            { value: 'REQUIREMENTS', path: '/requirements?type=FOR_SALE', label: 'نیازمندی ها' },
          ]}
          onChange={(option) => setTimeout(() => router.push(option.path), 250)}
        />

        <SegmentedControl
          value={selectedType}
          segments={[
            { value: 'FOR_SALE', path: '/ads/for_sale', label: 'خرید و فروش' },
            { value: 'FOR_RENT', path: '/ads/for_rent', label: 'رهن و اجاره' },
          ]}
          onChange={(option) => router.push(option.path)}
          className="!bg-green-100 !text-teal-600 before:!bg-teal-600"
        />

        <AdCategoryNavigation items={categories} adType={adType} />
      </div>

      {categories.map(
        (cat) =>
          cat.enabled && (
            <AdsList
              key={cat.id}
              useQuery={useGetAds}
              adCat={cat.cat}
              adType={adType}
              label={cat.title}
              link={createAdCategoryLink(adType, cat.cat)}
            />
          )
      )}

      <Link
        ref={addRef}
        href="/ads/new"
        style={{ left: `${offsetLeft}px` }}
        className="fixed left-7 bottom-28 grid place-items-center size-14 bg-teal-600 text-white rounded-full z-[110]"
      >
        <PlusIcon size={28} />
      </Link>
    </>
  )
}
