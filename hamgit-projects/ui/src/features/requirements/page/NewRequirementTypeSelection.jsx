import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BottomCTA, HeaderNavigation, PageFooter } from '@/features/app'
import { requirementTypeOptions } from '../constants'
import { cn } from '@/utils/dom'
import Button from '@/components/ui/Button'
import { useEitaa } from '@/features/eitaa'
import { PencilEditLineIcon, SupportIcon } from '@/components/icons'
import bubbleQuestionSvg from '@/assets/images/bubble_question.svg'

function NewRequirementTypeSelectionPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState({})
  const { isEitaa } = useEitaa()
  const handleNextPage = () => {
    router.push(`/requirements/new${selectedType.path}`)
  }

  return (
    <>
      <HeaderNavigation title="ثبت نیازمندی" />

      <div className="my-auto px-6">
        <div className="mb-20">
          <Image
            alt="نیازمندی"
            width={128}
            height={120}
            className="mx-auto"
            src={bubbleQuestionSvg.src}
          />

          <div className="text-center mb-11">
            <h3 className="font-bold text-lg">ثبت نیازمندی</h3>
            <span className="text-[#878787] text-sm">گزینه مورد نظر خود را انتخاب کنید</span>
          </div>

          <div className="flex max-w-lg gap-6 mx-auto">
            {requirementTypeOptions.map((option) => {
              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'flex-1 h-[128px] rounded-2xl flex flex-col gap-2 justify-center items-center border border-rust-300',
                    selectedType.value === option.value
                      ? 'bg-[#8A2E0D] text-white'
                      : 'text-rust-300'
                  )}
                  onClick={() => setSelectedType(option)}
                >
                  <Image
                    alt={option.label}
                    src={selectedType.value === option.value ? option.iconActive : option.icon}
                    width={44}
                    height={40}
                  />
                  <span className="font-bold">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <PageFooter descriptionTitle="ثبت نیازمندی‌ها" isEitaa={isEitaa}>
        {isEitaa ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PencilEditLineIcon color="#676767" />
              <p className="text-gray-600 text-sm">مشخصات خونه‌ای که می‌خوای رو تکمیل کن</p>
            </div>

            <div className="flex items-center gap-2">
              <SupportIcon color="#676767" />
              <p className="text-gray-600 text-sm">
                کارشناسان ما در اولین فرصت با شما تماس می‌گیرن
              </p>
            </div>
          </div>
        ) : (
          <p>
            اگه دنبال خونه برای خرید می‌گردی یا می‌خوای اجاره کنی، مشخصات ملک مد نظرت رو با مبلغی که
            می‌تونی برای رهن و اجاره یا خرید خونه بپردازی اینجا ثبت کن تا کسانی که می‌خوان خونه
            اجاره بدن یا بفروشن با شما ارتباط بگیرن. این‌طوری علاوه بر این که خودت دنبال خونه
            می‌گردی، بقیه هم که خونه دارن دنبال شما می‌گردن و یه تعامل دو طرفه صورت می‌گیره.
            <br />
            حالا یه سری هم به صفحۀ «
            <Link href="/ads/new" className="text-blue-600">
              آگهی‌ها
            </Link>
            » بزن به احتمال خیلی زیاد خونۀ مورد نظرت رو می‌تونی پیدا کنی. اگه یه موقع هم خواستی خونه
            بفروشی یا اجاره بدی، می‌تونی اونجا آگهی خونه‌ات رو بذاری.
          </p>
        )}
      </PageFooter>

      <BottomCTA>
        <Button className="w-full" onClick={handleNextPage} disabled={!selectedType.value}>
          ادامه
        </Button>
      </BottomCTA>
    </>
  )
}

export default NewRequirementTypeSelectionPage
