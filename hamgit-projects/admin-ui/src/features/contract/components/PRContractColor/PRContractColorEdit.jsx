import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import { Form, SelectField, useForm } from '@/components/ui/Form'
import { contractColorOptions } from '@/data/enums/prcontract-enums'
import usePostPRContractColor from '../../api/post-pr-contract-color'

const PRContractColorEdit = ({ prContract, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: pickWithDefaults(prContract, {
      color: { path: 'contract.color', default: null },
    }),
  })

  const postColorMutation = usePostPRContractColor(prContract?.contract.id)

  const handleSubmit = (data, { setError }) => {
    postColorMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success('رنگ قرارداد با موفقیت ویرایش شد.')

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
          <span className="text-gray-500">رنگ فعلی قرارداد: </span>
          <span>
            {prContract?.contract?.color
              ? contractColorOptions.find((opt) => opt.value === prContract.contract.color)
                  ?.label || '-'
              : 'بدون رنگ'}
          </span>
        </div>

        <SelectField asValue label="رنگ جدید قرارداد" name="color" options={contractColorOptions} />

        <div className="text-left">
          <Button
            size="sm"
            variant="gray"
            onClick={onCancel}
            disabled={postColorMutation.isPending}
          >
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
          <Button size="sm" type="submit" className="mr-2" loading={postColorMutation.isPending}>
            <DocumentEditIcon size={14} className="ml-1" /> ویرایش
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PRContractColorEdit
