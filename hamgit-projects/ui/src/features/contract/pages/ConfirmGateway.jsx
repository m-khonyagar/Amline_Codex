import { useRouter } from 'next/router'
import { CircleCheckBoldIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { BottomCTA } from '@/features/app'

function ConfirmGateway() {
  const router = useRouter()
  const { contractId } = router.query
  const handlePushContract = () => {
    router.push(`/contracts/${contractId}`)
  }

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0">
      <div className="text-green-500 flex flex-col items-center justify-center h-full">
        <CircleCheckBoldIcon size={80} />
        <div className="flex flex-col  gap-3 justify-start items-center w-[90%] text-center p-10">
          <h3 className="text-xl">پرداخت با موفقیت انجام شد</h3>
        </div>
      </div>
      <BottomCTA>
        <Button className="w-[100%]" onClick={handlePushContract}>
          بازگشت به قرارداد
        </Button>
      </BottomCTA>
    </div>
  )
}

export default ConfirmGateway
