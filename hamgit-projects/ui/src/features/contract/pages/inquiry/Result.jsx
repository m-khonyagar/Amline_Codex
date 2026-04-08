import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { format } from 'date-fns-jalali'
import { useGetContractInquiryQuery } from '../../api/get-contracts-inquire'
import Divider from '../../../commission/components/Divider'
import Button from '@/components/ui/Button'
import { HeaderNavigation } from '@/features/app'
import { contractTypeEnumOptions } from '@/features/contract'
import { TrackingCodeStatusEnumsTranslation } from '@/data/enums/tracking_code_status_enums'
import LoadingAndRetry from '@/components/LoadingAndRetry'

export default function ResultInquiryContractPage() {
  const router = useRouter()
  const { key, password } = router.query

  const getContractInquiryQuery = useGetContractInquiryQuery(key, password)

  const data = useMemo(() => getContractInquiryQuery?.data, [getContractInquiryQuery?.data])

  return (
    <>
      <HeaderNavigation title="استعلام قرارداد" />

      <div className="my-auto text-center px-[27px] fa">
        <div className="bg-white rounded-[12px] boxShadow px-[15px] pt-[13px] pb-[8px] flex flex-col gap-[8px]">
          <LoadingAndRetry query={getContractInquiryQuery}>
            {data && (
              <>
                <p>{`شماره قرارداد: ${key}`}</p>
                <div className="flex justify-between">
                  <span>تاریخ ایجاد قرارداد:</span>
                  <span>{data.date && format(data.date, 'yyyy/MM/dd')} </span>
                </div>
                <div className="flex justify-between">
                  <span>نوع قرارداد:</span>
                  <span>{contractTypeEnumOptions.find((i) => i.value === data.type)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>وضعیت کد رهگیری:</span>
                  <span>{TrackingCodeStatusEnumsTranslation[data.tracking_code_status]}</span>
                </div>
                <Divider />
                <Button
                  className="w-full mt-1"
                  href={`/contracts/inquiry/${key}/${password}/draft`}
                >
                  جزئیات
                </Button>
              </>
            )}
          </LoadingAndRetry>
        </div>
      </div>
    </>
  )
}
