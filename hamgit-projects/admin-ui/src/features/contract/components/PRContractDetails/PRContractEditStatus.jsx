import Button from '@/components/ui/Button'
import { translateEnum } from '@/utils/enum'
import { toast } from '@/components/ui/Toaster'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import { Form, SelectField, useForm } from '@/components/ui/Form'
import { contractStatusOptions } from '@/data/enums/prcontract-enums'
import usePatchPRContractStatus from '../../api/patch-pr-contract-status'

const statuses = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ADMIN_REJECTED: 'ADMIN_REJECTED',
}

const statusOptions = [
  { value: statuses.ACTIVE, label: 'فعال' },
  { value: statuses.COMPLETED, label: 'تایید اطلاعات' },
  { value: statuses.ADMIN_REJECTED, label: 'رد قرارداد' },
]
const PRContractEditStatus = ({ prContract, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: pickWithDefaults(prContract, {
      status: { path: 'contract.status', default: '' },
    }),
  })

  const patchStatusMutation = usePatchPRContractStatus(prContract?.contract.id)

  const handleSubmit = (data, { setError }) => {
    patchStatusMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success('وضعیت قرارداد با موفقیت ویرایش شد.')

        onSuccess(res)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  return (
    <div>
      <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <span className="text-gray-500">وضعیت فعلی قرارداد: </span>
          <span>{translateEnum(contractStatusOptions, prContract?.contract.status)}</span>
        </div>

        <SelectField asValue label="وضعیت جدید قرارداد" name="status" options={statusOptions} />

        <div className="text-left">
          <Button
            size="sm"
            variant="gray"
            onClick={onCancel}
            disabled={patchStatusMutation.isPending}
          >
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
          <Button size="sm" type="submit" className="mr-2" loading={patchStatusMutation.isPending}>
            <DocumentEditIcon size={14} className="ml-1" /> ویرایش
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PRContractEditStatus
