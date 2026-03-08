import { cn } from '@/utils/dom'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetPRContractInfo } from '../../api/get-pr-contract-info'
import PRContractColorEdit from './PRContractColorEdit'
import { contractColorOptions, contractColor } from '@/data/enums/prcontract-enums'

const getColorClass = (color) => {
  if (!color) return ''
  switch (color) {
    case contractColor.RED:
      return 'bg-red-50 border-red-200 text-red-800'
    case contractColor.GREEN:
      return 'bg-green-50 border-green-200 text-green-800'
    case contractColor.PURPLE:
      return 'bg-purple-50 border-purple-200 text-purple-800'
    default:
      return ''
  }
}

const PRContractColor = ({ contractId, className }) => {
  const prContractQuery = useGetPRContractInfo(contractId)
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)

  const prContract = prContractQuery.data
  const color = prContract?.contract?.color
  const colorLabel =
    color && contractColorOptions.find((opt) => opt.value === color)
      ? contractColorOptions.find((opt) => opt.value === color).label
      : 'بدون رنگ'

  return (
    <div className={cn('fa', className)}>
      <div className="border-b mb-4 flex flex-wrap items-center min-h-[44px]">
        <h2 className="font-semibold my-2">رنگ قرارداد</h2>

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
            <div className="text-sm text-gray-700">رنگ قرارداد:</div>
            <div className={cn('mr-auto px-3 py-1 rounded border', getColorClass(color))}>
              {colorLabel}
            </div>
          </div>
        </div>
      </LoadingAndRetry>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenEditDialog}
        onOpenChange={(s) => setIsOpenEditDialog(s)}
        title={`ویرایش رنگ قرارداد`}
      >
        <PRContractColorEdit
          prContract={prContract}
          onCancel={() => setIsOpenEditDialog(false)}
          onSuccess={() => setIsOpenEditDialog(false)}
        />
      </Dialog>
    </div>
  )
}

export default PRContractColor
