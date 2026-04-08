import { useRouter } from 'next/router'
import { CircleCheckBoldIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { BottomCTA } from '@/features/app'
import { Skeleton } from '@/components/ui/Skeleton'
import useContractLogic from '../../hooks/use-contract-logic'
import useGetContractStatus from '../../api/get-contract-status'

function SuccessSign() {
  const router = useRouter()
  const { contractId } = router.query

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery
  const { isCurrentUserFirstSide } = useContractLogic(statuses)

  const handlePushContract = () => {
    router.push(`/contracts/${contractId}`)
  }

  const handlePushPayment = () => {
    router.push(`/contracts/${contractId}/invoice`)
  }
  return (
    <>
      <div className="my-auto">
        <div className="text-green-500 flex flex-col items-center justify-center">
          <CircleCheckBoldIcon size={80} />
          <div className="flex flex-col gap-3 justify-start items-center text-center p-10 max-w-md">
            <h3 className="text-xl">امضای شما با موفقیت انجام شد!</h3>

            {contractStatusQuery.isPending ? (
              <TextSkeleton />
            ) : (
              <p>
                {isCurrentUserFirstSide
                  ? 'لینک قرارداد برای مستاجر ملک شما ارسال شد. منتظر امضای قرارداد توسط مستاجر باشید.'
                  : 'قرارداد شما در حال بررسی توسط کارشناسان حقوقی املاین است. برای صدور کد رهگیری و نمایش قرارداد هزینه کمیسیون را پرداخت کنید.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <BottomCTA>
        {isCurrentUserFirstSide ? (
          <Button className="w-full" onClick={handlePushContract}>
            مشاهده روند قرارداد
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button className="w-full" onClick={handlePushPayment}>
              پرداخت
            </Button>
            <Button variant="outline" className="w-full" onClick={handlePushContract}>
              بازگشت
            </Button>
          </div>
        )}
      </BottomCTA>
    </>
  )
}

export default SuccessSign

export function TextSkeleton() {
  return (
    <div className="flex flex-col gap-6 mt-7 justify-center items-center">
      <Skeleton className="w-[300px] h-2 rounded-md" />
      <Skeleton className="w-[170px] h-2 rounded-md" />
      <Skeleton className="w-[210px] h-2 rounded-md" />
      <Skeleton className="w-[100px] h-2 rounded-md" />
    </div>
  )
}
