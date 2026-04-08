import { format } from 'date-fns-jalali'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetHistoryFiles } from '../../api/get-history-files'
import { FileStatusLabels } from '@/data/enums/market_enums'

const labels = {
  file_status: 'وضعیت فایل',
  assigned_to: 'مسئول فایل',
}

export const AssignedTab = ({ fileId }) => {
  const assignedFilesQuery = useGetHistoryFiles(fileId, {
    fields: ['assigned_to', 'file_status'],
    filter_type: 'include',
  })
  const assigned = assignedFilesQuery.data || []

  return (
    <LoadingAndRetry query={assignedFilesQuery}>
      {assigned.length > 0 ? (
        <ul>
          {assigned.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 p-2 border-b border-gray-200 fa"
            >
              <span className="text-nowrap">{labels[item.entity_field]}</span>
              <span className="text-[#B3B3B3] text-nowrap text-center">
                {format(item.created_at, 'yyyy/MM/dd - HH:mm')} ({item.user?.fullname})
              </span>
              <div className="flex items-center flex-nowrap justify-end gap-2.5">
                <span>
                  {item.entity_field === 'file_status'
                    ? FileStatusLabels[item.old_value]
                    : item.old_value}
                </span>
                <span>{'>'}</span>
                <span>
                  {item.entity_field === 'file_status'
                    ? FileStatusLabels[item.old_value]
                    : item.old_value}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-4">
          هیچ فعالیتی برای این فایل ثبت نشده است.
        </div>
      )}
    </LoadingAndRetry>
  )
}
