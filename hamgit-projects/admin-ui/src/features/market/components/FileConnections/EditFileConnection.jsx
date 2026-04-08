import { Form, InputField, SelectField, useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { FileConnectionStatusOptions, FileConnectionStatusLabels } from '@/data/enums/market_enums'
import { useUpdateFileConnection } from '../../api/update-file-connection'
import { handleErrorOnSubmit } from '@/utils/error'
import { toast } from '@/components/ui/Toaster'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  status: z.string().min(1, 'وضعیت را انتخاب کنید'),
  description: z.string(),
})

const defaultValues = {
  status: '',
  description: '',
}

export const EditFileConnection = ({ connection, onSuccess, onCancel }) => {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
    values: {
      status: connection?.status || '',
      description: connection?.description || '',
    },
  })

  const updateConnectionMutation = useUpdateFileConnection({
    onSuccess: () => {
      toast.success('وضعیت اتصال با موفقیت ویرایش شد')
      onSuccess?.()
      methods.reset()
    },
    onError: handleErrorOnSubmit,
  })

  const handleSubmit = (data) => {
    updateConnectionMutation.mutate({
      id: connection.id,
      data: {
        status: data.status,
        description: data.description,
      },
    })
  }

  const handleCancel = () => {
    methods.reset()
    onCancel?.()
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="p-2.5 bg-gray-100 rounded-lg flex gap-2.5">
          <div className="text-gray-500 font-medium leading-normal">وضعیت فعلی:</div>

          <div className="text-zinc-900 font-medium leading-normal">
            {FileConnectionStatusLabels[connection?.status]}
          </div>
        </div>

        <SelectField
          asValue
          label="وضعیت جدید"
          name="status"
          options={FileConnectionStatusOptions}
          placeholder="انتخاب کنید"
        />

        <InputField
          label="توضیحات وضعیت"
          name="description"
          multiline
          rows={4}
          placeholder="توضیحات وضعیت را وارد کنید"
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="gray"
            onClick={handleCancel}
            disabled={updateConnectionMutation.isPending}
          >
            انصراف
          </Button>
          <Button type="submit" loading={updateConnectionMutation.isPending}>
            ثبت
          </Button>
        </div>
      </div>
    </Form>
  )
}
