import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { HeaderNavigation, PageFooter, useAppContext } from '@/features/app'
import SegmentedControl from '@/components/ui/SegmentedControl'
import WantedList from '../components/WantedList'
import SwapsList from '../components/SwapsList'
import { requirementTypeOptions } from '../constants'
import { RequirementTypeEnums } from '@/data/enums/requirement_type_enums'
import { LocationBold2Icon, PlusIcon } from '@/components/icons'
import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect'

function RequirementsPage() {
  const router = useRouter()
  const { defaultCities, setIsOpen } = useAppContext()
  const type = router.isReady ? router.query.type : ''
  const selectedType = useMemo(() => requirementTypeOptions.find((o) => o.value === type), [type])
  const changeFilter = (_filters) => router.push({ query: { ..._filters } })

  const addRef = useRef()
  const [offsetLeft, setOffsetLeft] = useState(24)

  useEffect(() => {
    if (router.isReady && !type)
      router.replace({ query: { ...router.query, type: RequirementTypeEnums.BUY } })
  }, [router, type])

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

      <div className="flex-grow p-7 flex flex-col">
        <SegmentedControl
          defaultValue={{ value: 'REQUIREMENTS' }}
          segments={[
            { value: 'ADS', path: '/ads/for_sale', label: 'آگهی ها' },
            { value: 'REQUIREMENTS', path: '/requirements?type=FOR_SALE', label: 'نیازمندی ها' },
          ]}
          onChange={(option) => setTimeout(() => router.push(option.path), 250)}
        />

        <SegmentedControl
          value={selectedType}
          segments={requirementTypeOptions}
          onChange={(option) => changeFilter({ type: option.value })}
          className="!bg-green-100 !text-teal-600 before:!bg-teal-600 !mt-3.5 !mb-7"
        />

        {type === RequirementTypeEnums.SWAP ? <SwapsList /> : <WantedList />}
      </div>

      <Link
        ref={addRef}
        href="/requirements/new"
        style={{ left: `${offsetLeft}px` }}
        className="fixed left-7 bottom-28 grid place-items-center size-14 bg-teal-600 text-white rounded-full z-[110]"
      >
        <PlusIcon size={28} />
      </Link>

      <PageFooter descriptionTitle="نیازمندی‌ها">
        <p>
          تو این صفحه می‌تونی انواع نیازمندی‌های کاربران که دنبال خونه برای خرید یا اجاره هستن با
          جزئیات و مشخصات مربوطه ببینی و اگه خونه برای فروش یا اجاره داری باهاشون ارتباط بگیری و
          پیشنهاد بدی. همچنین اگه مشاور املاک هستی، می‌تونی اینجا با هر کدوم از این‌ها گفتگو کنی و
          به فروشنده‌ها و اجاره‌دهنده‌ها وصلشون کنی.
          <br />
          همچنین می‌تونی با رفتن به صفحۀ «
          <Link className="text-blue-600" href="/ads/new">
            ثبت آگهی
          </Link>
          » و ثبت مشخصات ملکت، برای خرید و فروش تبلیغ کنی و در معرض نمایش بذاری تا نیازمندان به خرید
          یا اجاره به سراغ شما بیان و زودتر مشتری پیدا کنی.
        </p>
      </PageFooter>
    </>
  )
}

export default RequirementsPage
