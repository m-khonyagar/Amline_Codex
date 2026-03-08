import LoadingAndRetry from '@/components/LoadingAndRetry'
import { format } from 'date-fns-jalali'
import { FileConnectionStatusLabels } from '@/data/enums/market_enums'
import { useGetAllHistoryFiles } from '../../api/get-history-files'

const labels = {
  status: 'وضعیت',
  description: 'توضیحات',
}

const formatActivityValue = (value, entityField) => {
  if (value === 'None') return '--'

  switch (entityField) {
    case 'status':
      return FileConnectionStatusLabels[value]

    default:
      return value
  }
}

export const FileConnectionHistory = ({ fileConnectionId }) => {
  const { data: history = [], ...activityFilesQuery } = useGetAllHistoryFiles(fileConnectionId)
  console.log(history)

  return (
    <LoadingAndRetry query={activityFilesQuery}>
      {history.length > 0 ? (
        <ul className="max-h-96 overflow-y-auto">
          {history.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 p-2 border-b border-gray-200 fa"
            >
              {
                <>
                  <span className="text-nowrap">{labels[item.entity_field]}</span>
                  <span className="text-[#B3B3B3] text-nowrap text-center">
                    {format(item.created_at, 'yyyy/MM/dd - HH:mm')} ({item.user?.fullname})
                  </span>
                  <div className="flex items-center flex-nowrap justify-end gap-2.5">
                    <span>{formatActivityValue(item.old_value, item.entity_field)}</span>
                    <span>{'>'}</span>
                    <span>{formatActivityValue(item.new_value, item.entity_field)}</span>
                  </div>
                </>
              }
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
