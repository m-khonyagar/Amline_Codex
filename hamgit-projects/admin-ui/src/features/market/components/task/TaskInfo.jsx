import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetTaskInfo } from '../../api/task-queries'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import { CloseIcon, PlusIcon } from '@/components/icons'
import { TaskStatusEnum, TaskStatusOptions } from '@/data/enums/market_enums'
import { format } from 'date-fns-jalali'
import { cn } from '@/utils/dom'
import Select from '@/components/ui/Select'
import { useAddReportTask, useUpdateTask } from '../../api/task-mutations'
import Input from '@/components/ui/Input'
import { toast } from '@/components/ui/Toaster'

export const TaskInfo = ({ id }) => {
  const navigate = useNavigate()
  const [isOpenReportForm, setIsOpenReportForm] = useState(false)
  const [report, setReport] = useState('')

  const getTaskInfoQuery = useGetTaskInfo(id)
  const task = getTaskInfoQuery.data || {}

  const updateTask = useUpdateTask(id)
  const addReportTask = useAddReportTask()

  const addReport = (data) => {
    addReportTask.mutate(data, {
      onSuccess: () => {
        toast.success('گزارش با موفقیت ایجاد شد')
        setIsOpenReportForm(false)
      },
    })
  }

  return (
    <div className="bg-white max-w-5xl w-full mx-auto rounded-2xl px-6 py-8">
      <LoadingAndRetry query={getTaskInfoQuery}>
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-6 pb-4 border-b border-neutral-200">
            <h1 className="text-zinc-900 text-xl font-medium">{task.title}</h1>

            <Select
              asValue
              floatError
              options={TaskStatusOptions}
              value={task.status}
              loading={updateTask.isPending}
              onChange={(v) => {
                if (v !== task.status) updateTask.mutate({ status: v })
              }}
              wrapperClassName="bg-teal-600 rounded-md w-36 text-white text-sm font-semibold !border-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="py-4 px-2 bg-gray-50 rounded-lg flex items-center">
              <span className="text-neutral-500">ثبت کننده:</span>
              <span className="mr-2 text-gray-900">{task.created_by_user?.fullname}</span>
            </div>

            <div className="py-4 px-2 bg-gray-50 rounded-lg flex items-center">
              <span className="text-neutral-500">ارجاع به کارشناس:</span>
              <span className="mr-2 text-gray-900">{task.assigned_to_user?.fullname}</span>
            </div>

            <div className="py-4 px-2 bg-gray-50 rounded-lg flex items-center">
              <span className="text-neutral-500">مهلت انجام:</span>
              <span
                className={cn('mr-2 text-gray-900 fa', {
                  'text-red-500':
                    task.status !== TaskStatusEnum.DONE &&
                    new Date(task.due_date).getTime() - Date.now() < 86_400_000,
                })}
              >
                {task.due_date ? format(new Date(task.due_date), 'dd MMMM yyyy - HH:mm') : 'ندارد'}
              </span>
            </div>
          </div>

          <div className="bg-zinc-100 rounded-lg py-4 px-2">
            <h3 className="text-neutral-500 mb-2">شرح وظیفه</h3>
            <p className="text-stone-900">{task.description}</p>
          </div>

          {task?.task_reports?.length > 0 && (
            <div className="text-neutral-400">
              <p>گزارشات</p>
              <ul className="list-disc list-inside">
                {task.task_reports.map((report) => (
                  <li key={report.id}>{report.text}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            {!isOpenReportForm ? (
              <Button size="sm" onClick={() => setIsOpenReportForm(true)}>
                <PlusIcon size={14} className="ml-2" />
                افزودن گزارش
              </Button>
            ) : (
              <div>
                <Input
                  label="گزارش"
                  multiline
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                />

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="gray"
                    onClick={() => setIsOpenReportForm(false)}
                    disabled={addReportTask.isPending}
                  >
                    انصراف
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => addReport({ task_id: id, text: report })}
                    loading={addReportTask.isPending}
                  >
                    ثبت گزارش
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-left">
            <Button size="sm" variant="gray" className="mr-2" onClick={() => navigate(-1)}>
              <CloseIcon size={14} className="ml-1" /> بستن
            </Button>

            <Button
              size="sm"
              type="submit"
              className="mr-2"
              onClick={() => navigate(`/market/task/${id}/edit`)}
            >
              <PlusIcon size={14} className="ml-1" />
              ویرایش
            </Button>
          </div>
        </div>
      </LoadingAndRetry>
    </div>
  )
}
