import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import { TrackingCodeStatusOptions } from '@/data/enums/prcontract-enums'
import { Form, InputField, SelectField, useForm } from '@/components/ui/Form'
import usePatchPRContractTrackingCode from '../../api/patch-pr-contract-tracking-code'

const PRContractTrackingCodeEdit = ({ prContract, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: pickWithDefaults(prContract, {
      status: { path: 'tracking_code.status', default: '' },
      value: { path: 'tracking_code.value', default: '' },
    }),
  })

  const patchTrackingCodeMutation = usePatchPRContractTrackingCode(prContract?.contract.id)

  const handleSubmit = (data, { setError }) => {
    patchTrackingCodeMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success('وضعیت کد رهگیری با موفقیت ویرایش شد.')
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
        <SelectField
          asValue
          required
          name="status"
          label="وضعیت کد رهگیری"
          options={TrackingCodeStatusOptions}
        />

        <InputField name="value" label="کد رهگیری" />

        <div className="text-left">
          <Button
            size="sm"
            variant="gray"
            onClick={onCancel}
            disabled={patchTrackingCodeMutation.isPending}
          >
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
          <Button
            size="sm"
            type="submit"
            className="mr-2"
            loading={patchTrackingCodeMutation.isPending}
          >
            <DocumentEditIcon size={14} className="ml-1" /> ویرایش
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PRContractTrackingCodeEdit
