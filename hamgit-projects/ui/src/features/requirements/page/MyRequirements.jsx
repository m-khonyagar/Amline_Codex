import { useRef, useState } from 'react'
import Link from 'next/link'
import { HeaderNavigation } from '@/features/app'
import SegmentedControl from '@/components/ui/SegmentedControl'
import MyWanted from '../components/MyWanted'
import MySwaps from '../components/MySwaps'
import { useIsomorphicEffect } from '@/hooks/use-isomorphic-effect'
import { PlusIcon } from '@/components/icons'

const requirementTypeOptions = [
  {
    value: 'buy-rental',
    label: 'خرید - رهن و اجاره',
  },
  {
    value: 'swap',
    label: 'معاوضه',
  },
]

function MyRequirements() {
  const [activeTab, setActiveTab] = useState(requirementTypeOptions[0])

  const addRef = useRef()
  const [offsetLeft, setOffsetLeft] = useState(24)

  useIsomorphicEffect(() => {
    if (!addRef.current) return

    const mainEl = document.querySelector('#__main')
    setOffsetLeft(window.innerWidth - mainEl.offsetWidth - mainEl.offsetLeft + 24)
  }, [])

  return (
    <>
      <HeaderNavigation title="نیازمندی های من" />

      <div className="flex-grow p-4 flex flex-col gap-5">
        <SegmentedControl
          value={activeTab}
          segments={requirementTypeOptions}
          onChange={(option) => setActiveTab(option)}
        />

        <div className="flex flex-col gap-5">
          {activeTab.value === 'swap' ? <MySwaps /> : <MyWanted />}
        </div>
      </div>

      <Link
        ref={addRef}
        href="/requirements/new"
        style={{ left: `${offsetLeft}px` }}
        className="fixed left-7 bottom-28 grid place-items-center size-14 bg-teal-600 text-white rounded-full z-[110]"
      >
        <PlusIcon size={28} />
      </Link>
    </>
  )
}

export default MyRequirements
