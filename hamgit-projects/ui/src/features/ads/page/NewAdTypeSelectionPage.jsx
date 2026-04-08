import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BottomCTA, HeaderNavigation, PageFooter } from '@/features/app'
import commercialImg from '@/assets/images/commercial.svg'
import { adTypeOptions } from '../constants'
import { cn } from '@/utils/dom'
import Button from '@/components/ui/Button'

export default function NewAdTypeSelectionPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState({})
  const handleNextPage = () => {
    router.push(`/ads/new${selectedType.path}`)
  }

  return (
    <>
      <HeaderNavigation title="ثبت آگهی" />
      <div className="my-auto px-6">
        <div className="mb-20">
          <Image
            alt="ثبت آگهی"
            width={128}
            height={128}
            className="mx-auto mb-2"
            src={commercialImg.src}
          />

          <div className="text-center mb-5">
            <h3 className="font-bold text-lg">ثبت آگهی</h3>
            <span className="text-[#878787] text-sm">گزینه مورد نظر خود را انتخاب کنید</span>
          </div>

          <div className="flex max-w-lg gap-6 mx-auto">
            {adTypeOptions.map((option) => {
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
        <PageFooter descriptionTitle="ثبت آگهی">
          <p>
            اگه خونه داری که می‌خوای بفروشی یا اجاره بدی، کافیه مشخصات و مبلغ مورد نظرت رو اینجا ثبت
            کنی تا کسانی که نیاز دارن و شرایطشون به شما می‌خوره باهاتون ارتباط بگیرن و هر دو به
            هدفتون برسید. همچنین بنگاه‌ها و مشاورین املاک هم به این آگهی‌ها سر می‌زنن و در صورت پیدا
            شدن مشتری به سراغ شما میان.
            <br />
            باتوجه به این که دنبال مشتری می‌گردی، بهتره یه نگاهی به صفحۀ «
            <Link href="/requirements" className="text-blue-600">
              نیازمندی‌ها
            </Link>
            » بزنی. اونجا مشتری‌ها خونۀ مطلوبشون رو ثبت کردن. به احتمال خیلی زیاد مشتری متناسب با
            ملک خودت رو پیدا می‌کنی و می‌تونی هماهنگ کنی بیاد برای بازدید.
          </p>
        </PageFooter>
      </div>
      <BottomCTA>
        <Button className="w-full" onClick={handleNextPage} disabled={!selectedType.value}>
          ادامه
        </Button>
      </BottomCTA>
    </>
  )
}
