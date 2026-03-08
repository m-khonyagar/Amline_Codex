import { useRouter } from 'next/router'
import { CircleLoadingClockIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { BottomCTA, HeaderNavigation } from '@/features/app'

function PublishStatusPage() {
  const router = useRouter()
  const adType = router.query.ad_type
  const link = adType ? `/ads/${adType}` : '/profile/my-ads'

  return (
    <>
      <HeaderNavigation title="انتشار آگهی" href="/" />
      <div className="flex flex-1 flex-col bg-background px-6">
        <div className="flex flex-col items-center gap-3 justify-center my-auto mx-4">
          <CircleLoadingClockIcon size={70} color="#53BB6A" />

          <h4 className="font-bold text-green-600 text-[18px]">در صف انتشار</h4>

          <div className="text-center">
            <span className="text-green-600">آگهی شما با موفقیت ثبت شد. </span>
            <br />
            <span className="text-green-600">زمان انتظار در صف حداکثر 2 ساعت می باشد.</span>
          </div>
        </div>
        <BottomCTA>
          <Button href={link} className="w-full mt-20">
            صفحه آگهی ها
          </Button>
        </BottomCTA>
      </div>
    </>
  )
}

export default PublishStatusPage
