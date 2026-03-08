import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { TaskStatusEnum, TaskStatusOptions } from '@/data/enums/market_enums'
import { pickWithDefaults } from '@/utils/object'
import { useGetAdModerators } from '../../api/get-ad-moderators'
import { useGetTaskInfo } from '../../api/task-queries'
import { useCreateTask, useUpdateTask } from '../../api/task-mutations'
import { DatePickerField, Form, InputField, SelectField, useForm } from '@/components/ui/Form'
import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import { CloseIcon, PlusIcon } from '@/components/icons'
import { handleErrorOnSubmit } from '@/utils/error'
import { format } from 'date-fns'

const formSchema = z.object({
  title: z.string().min(1, 'عنوان وظیفه الزامی است'),
  description: z.string().optional(),
  assigned_to: z.string().min(1, 'ارجاع به کارشناس الزامی است'),
  status: z.enum(Object.values(TaskStatusEnum), { message: 'وضعیت الزامی است' }),
  due_date: z.string().optional(),
})

const defaultValues = {
  title: '',
  description: undefined,
  assigned_to: '',
  status: TaskStatusEnum.TODO,
  due_date: undefined,
}

export const TaskForm = ({ id }) => {
  const navigate = useNavigate()

  const isEditMode = !!id
  const getTaskQuery = useGetTaskInfo(id)
  const data = isEditMode && getTaskQuery.data

  const methods = useForm({
    values: pickWithDefaults(
      {
        ...data,
        due_date: data?.due_date
          ? format(new Date(data.due_date), 'yyyy-MM-dd HH:mm:ss')
          : undefined,
      },
      defaultValues
    ),
    resolver: zodResolver(formSchema),
  })

  const { data: adModerators = [] } = useGetAdModerators()
  const adModeratorOptions = adModerators.map((moderator) => ({
    label: moderator.fullname,
    value: moderator.id,
  }))

  const createTask = useCreateTask({ onError: handleErrorOnSubmit })
  const updateTask = useUpdateTask(id, { onError: handleErrorOnSubmit })

  const create = (data) =>
    createTask.mutate(data, {
      onSuccess: ({ data }) => {
        toast.success('وظیفه با موفقیت ایجاد شد')
        navigate(`/market/task/${data.id}`, { replace: true })
      },
    })

  const update = (data) =>
    updateTask.mutate(data, {
      onSuccess: () => {
        toast.success('وظیفه با موفقیت ویرایش شد')
        navigate(`/market/task/${id}`, { replace: true })
      },
    })

  const handleSubmit = (data) => {
    const finalData = {
      ...data,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
    }

    if (isEditMode) update(finalData)
    else create(finalData)
  }

  return (
    <div className="bg-white rounded-2xl p-4 pb-10">
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4">
          <InputField label="عنوان وظیفه" name="title" />

          <SelectField
            asValue
            label="ارجاع به کارشناس"
            name="assigned_to"
            options={adModeratorOptions}
          />

          <SelectField asValue label="وضعیت" name="status" options={TaskStatusOptions} />

          <DatePickerField
            timePicker
            hideSeconds
            label="مهلت انجام"
            name="due_date"
            format="DD MMMM YYYY - HH:mm"
            inputFormat="yyyy-MM-dd HH:mm:ss"
            outputFormat="YYYY-MM-DD HH:mm:00"
          />

          <InputField label="شرح وظیفه" name="description" multiline />
        </div>

        <div className="mt-8 text-left">
          <Button
            size="sm"
            variant="gray"
            onClick={() => navigate(-1)}
            type="button"
            disabled={createTask.isPending || updateTask.isPending}
          >
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>

          <Button
            size="sm"
            type="submit"
            className="mr-2"
            loading={createTask.isPending || updateTask.isPending}
          >
            <PlusIcon size={14} className="ml-1" />
            {isEditMode ? 'ویرایش' : 'ایجاد'}
          </Button>
        </div>
      </Form>
    </div>
  )
}
