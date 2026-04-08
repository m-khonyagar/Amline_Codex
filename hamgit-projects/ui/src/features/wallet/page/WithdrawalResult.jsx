import { CircleCheckBoldIcon } from '@/components/icons'
import { BottomCTA } from '@/features/app'
import Button from '@/components/ui/Button'

export default function WithdrawalResult() {
  return (
    <>
      <div className="my-auto text-center">
        <div className="flex flex-col gap-6 justify-center items-center text-green-600">
          <CircleCheckBoldIcon size={64} />
          درخواست شما با موفقیت ثبت شد
        </div>
      </div>

      <BottomCTA>
        <Button className="w-full" href="/wallet" replace>
          بازگشت به کیف پول
        </Button>
      </BottomCTA>
    </>
  )
}
