import { cn } from '@/utils/dom'
import { useState } from 'react'
import { format } from 'date-fns-jalali'
import Button from '@/components/ui/Button'
import { translateEnum } from '@/utils/enum'
import { Dialog } from '@/components/ui/Dialog'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetPRContractInfo } from '../../api/get-pr-contract-info'
import PRContractTrackingCodeEdit from './PRContractTrackingCodeEdit'
import { TrackingCodeStatusOptions } from '@/data/enums/prcontract-enums'

const PRContractTrackingCode = ({ contractId, className }) => {
  const prContractQuery = useGetPRContractInfo(contractId)
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)

  const prContract = prContractQuery.data

  return (
    <div className={cn('fa', className)}>
      <div className="border-b mb-4 flex flex-wrap items-center min-h-[44px]">
        <h2 className="font-semibold my-2">کد رهگیری</h2>

        <Button
          size="xs"
          variant="gray"
          className="mr-auto my-2"
          onClick={() => setIsOpenEditDialog(true)}
        >
          ویرایش
        </Button>
      </div>

      <LoadingAndRetry query={prContractQuery} checkRefetching>
        <div className="bg-white rounded-lg flex flex-col gap-4 py-2 px-4">
          <div className="flex items-center">
            <div className="text-sm text-gray-700">وضعیت کد رهگیری:</div>
            <div className="mr-auto">
              {translateEnum(TrackingCodeStatusOptions, prContract?.tracking_code.status)}
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-sm text-gray-700">کد رهگیری:</div>
            <div className="mr-auto">
              {prContract?.tracking_code.value ? prContract.tracking_code.value : '-'}
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-sm text-gray-700">تاریخ صدور کد رهگیری:</div>
            <div className="mr-auto">
              {prContract?.tracking_code?.generation_date
                ? format(prContract?.tracking_code?.generation_date, 'dd MMMM yyyy')
                : '-'}
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-sm text-gray-700">رمز قرارداد:</div>
            <div className="mr-auto">{prContract?.password ? prContract.password : ''}</div>
          </div>
        </div>
      </LoadingAndRetry>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenEditDialog}
        onOpenChange={(s) => setIsOpenEditDialog(s)}
        title={`ویرایش کد رهگیری`}
      >
        <PRContractTrackingCodeEdit
          prContract={prContract}
          onCancel={() => setIsOpenEditDialog(false)}
          onSuccess={() => setIsOpenEditDialog(false)}
        />
      </Dialog>
    </div>
  )
}

export default PRContractTrackingCode
