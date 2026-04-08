import { CircleLoadingClockIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import { useEitaa } from '@/features/eitaa'

function PublishStatusPage() {
  const { isEitaa } = useEitaa()

  return (
    <>
      <HeaderNavigation title="انتشار نیازمندی" href="/" />
      <div className="flex flex-1 flex-col bg-background px-6">
        <div className="flex flex-col items-center gap-3 justify-center my-auto mx-4">
          <CircleLoadingClockIcon size={70} color="#53BB6A" />

          {!isEitaa && <h4 className="font-bold text-green-600 text-[18px]">در صف انتشار</h4>}

          {isEitaa ? (
            <p className="text-center text-green-600">
              کارشناسان املاین در اولین فرصت با شما تماس
              <br />
              خواهند گرفت
            </p>
          ) : (
            <div className="text-center">
              <span className="text-green-600">نیازمندی شما با موفقیت ثبت شد. </span>
              <br />
              <span className="text-green-600">زمان انتظار در صف حداکثر 2 ساعت می باشد.</span>
            </div>
          )}
        </div>
        <BottomCTA>
          {isEitaa ? (
            <Button href="/" className="w-full mt-20">
              صفحه اصلی
            </Button>
          ) : (
            <Button href="/requirements" className="w-full mt-20">
              صفحه نیازمندی ها
            </Button>
          )}
        </BottomCTA>
      </div>
    </>
  )
}

export default PublishStatusPage
